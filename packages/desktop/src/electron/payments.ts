import { inAppPurchase } from 'electron';
import fs from 'fs';

const PRODUCT_IDS = ['io.todaylist.today'];

async function sendTransactionsEvents(state, productIdentifier, userGuid, message) {
    const mainWindow = BrowserWindow.getAllWindows().find((win) => win.isMainWindow);
    if (!mainWindow) {
      return;
    }
    //
    const params = {
      state,
      productIdentifier,
      userGuid,
      message,
    };
    const paramsData = JSON.stringify(params);
    const script = `window.onTransactionsUpdated(${paramsData})`;
    await mainWindow.webContents.executeJavaScript(script);
  }
  

async function verifyPurchase(transaction, receiptURL) {
  //
  let receiptData = null;
  try {
    if (receiptURL.startsWith('/')) {
      receiptData = await fs.readFile(receiptURL);
    } else {
      receiptData = await request.downloadToData({
        url: receiptURL,
        method: 'GET',
      });
    }
  } catch (err) {
    const errorMessage = i18next.t('errorDownloadReceipt', {
      message: err.message,
    });
    throw new WizInternalError(errorMessage);
  }

  const userGuid = getCurrentUserGuid();
  const userData = sdk.getUserData(userGuid);
  const user = userData.user;
  //
  const server = userData.accountServer.server;
  //
  const data = {
    receipt: receiptData.toString('base64'),
    userGuid: user.userGuid,
    userId: user.userId,
    clientType: 'lite',
    apiVersion: app.getVersion(),
    transactionId: transaction.transactionIdentifier,
  };
  //
  try {
    await request.standardRequest({
      url: `${server}/as/pay2/ios`,
      data,
      method: 'POST',
    });
    //
    await sdk.refreshUserInfo(userGuid);
    //
    return true;
  } catch (err) {
    // const errorMessage = i18next.t('errorVerifyPurchase', {
    //   message: err.message,
    // });
    // throw new WizInternalError(errorMessage);
  }
}

function initializePayments(): void {
  if (
    process.platform === 'darwin' &&
    inAppPurchase &&
    inAppPurchase.canMakePayments()
  ) {
    // // Listen for transactions as soon as possible.
    // inAppPurchase.on('transactions-updated', (event, transactions) => {
    //   if (!Array.isArray(transactions)) {
    //     return;
    //   }

    //   // Check each transaction.
    //   transactions.forEach(function (transaction) {
    //     const payment = transaction.payment;

    //     switch (transaction.transactionState) {
    //       case 'purchasing':
    //         console.log(`Purchasing ${payment.productIdentifier}...`);
    //         break;

    //       case 'purchased': {
    //         console.log(`${payment.productIdentifier} purchased.`);

    //         // Get the receipt url.
    //         const receiptURL = inAppPurchase.getReceiptURL();

    //         console.log(`Receipt URL: ${receiptURL}`);

    //         // Submit the receipt file to the server and check if it is valid.
    //         // @see https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html
    //         // ...
    //         // If the receipt is valid, the product is purchased
    //         // ...

    //         // Finish the transaction.
    //         inAppPurchase.finishTransactionByDate(transaction.transactionDate);

    //         break;
    //       }

    //       case 'failed':
    //         console.log(`Failed to purchase ${payment.productIdentifier}.`);

    //         // Finish the transaction.
    //         inAppPurchase.finishTransactionByDate(transaction.transactionDate);

    //         break;
    //       case 'restored':
    //         console.log(
    //           `The purchase of ${payment.productIdentifier} has been restored.`
    //         );

    //         break;
    //       case 'deferred':
    //         console.log(
    //           `The purchase of ${payment.productIdentifier} has been deferred.`
    //         );

    //         break;
    //       default:
    //         break;
    //     }
    //   });

    inAppPurchase.on('transactions-updated', async (event, transactions) => {
        if (!Array.isArray(transactions)) {
          return;
        }
  
        // 检查每一笔交易.
        for (const transaction of transactions) {
          const payment = transaction.payment;
  
          switch (transaction.transactionState) {
            case 'purchasing':
              console.log(`Purchasing ${payment.productIdentifier}...`);
              await sendTransactionsEvents('purchasing', payment.productIdentifier);
              break;
  
            case 'purchased': {
              console.log(`${payment.productIdentifier} purchased.`);
              await sendTransactionsEvents('verifying', payment.productIdentifier);
              const receiptURL = inAppPurchase.getReceiptURL();
              try {
                const userGuid = await verifyPurchase(transaction, receiptURL);
                await sendTransactionsEvents('purchased', payment.productIdentifier, userGuid);
                inAppPurchase.finishTransactionByDate(transaction.transactionDate);
              } catch (err) {
                console.error(err);
                await sendTransactionsEvents('failed', payment.productIdentifier, null, err.message);
              }
              break;
            }
  
            case 'failed':
              console.log(`Failed to purchase ${payment.productIdentifier}.`);
              await sendTransactionsEvents('failed', payment.productIdentifier, null, transaction.errorMessage);
              inAppPurchase.finishTransactionByDate(transaction.transactionDate);
              break;
  
            case 'restored': {
              console.log(`The purchase of ${payment.productIdentifier} has been restored.`);
              await sendTransactionsEvents('verifying', payment.productIdentifier);
              const receiptURL = inAppPurchase.getReceiptURL();
              try {
                const userGuid = await verifyPurchase(transaction, receiptURL);
                await sendTransactionsEvents('restored', payment.productIdentifier, userGuid);
              } catch (err) {
                console.error(err);
                await sendTransactionsEvents('failed', payment.productIdentifier, null, err.message);
              }
              break;
            }
  
            case 'deferred':
              console.log(`The purchase of ${payment.productIdentifier} has been deferred.`);
              await sendTransactionsEvents('deferred', payment.productIdentifier);
              break;
  
            default:
              break;
          }
        }
      });
    });

    // Check if the user is allowed to make in-app purchase.
    if (!inAppPurchase.canMakePayments()) {
      console.log('The user is not allowed to make in-app purchase.');
    }

    // Retrieve and display the product descriptions.
    inAppPurchase.getProducts(PRODUCT_IDS).then((products) => {
      console.log('PRODUCTS', products);
      // Check the parameters.
      if (!Array.isArray(products) || products.length <= 0) {
        console.log('Unable to retrieve the product informations.');
        return;
      }

      // Display the name and price of each product.
      products.forEach((product) => {
        console.log(
          `The price of ${product.localizedTitle} is ${product.formattedPrice}.`
        );
      });

      // Ask the user which product he/she wants to purchase.
      const selectedProduct = products[0];
      const selectedQuantity = 1;

      // Purchase the selected product.
      inAppPurchase
        .purchaseProduct(selectedProduct.productIdentifier, selectedQuantity)
        .then((isProductValid) => {
          if (!isProductValid) {
            console.log('The product is not valid.');
            return;
          }

          console.log('The payment has been added to the payment queue.');
        });
    });
  }
}

export default initializePayments;
