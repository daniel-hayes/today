import { app, shell, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log, { ElectronLog } from 'electron-log';
import path from 'path';
import MenuBuilder from './menu';

autoUpdater.logger = log;
(autoUpdater.logger as ElectronLog).transports.file.level = 'info';

// autoUpdater.autoDownload = true
// autoUpdater.autoInstallOnAppQuit = true

log.info('App starting');

const isProd = process.env.NODE_ENV === 'production';

// @TODO implment this
const shouldFloat = process.env.FLOATING_WINDOW;

let mainWindow: BrowserWindow | null;

function createMainWindow() {
  const window = new BrowserWindow({
    minWidth: 250,
    minHeight: 130,
    maxWidth: 600,
    width: 500,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  window.loadFile(path.join(__dirname, 'index.html'));

  if (shouldFloat) {
    window.setAlwaysOnTop(true, 'floating', 1);
  }

  if (!isProd) {
    window.webContents.openDevTools();
  }

  window.webContents.setWindowOpenHandler(({ url }) => {
    // open url in a browser and prevent default
    shell.openExternal(url);
    return { action: 'deny' };
  });

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  // create global menu
  MenuBuilder(window, app.name).buildMenu();

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (contentsEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [];

    // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${parsedUrl}'. This origin is not whitelisted and the attempt to navigate was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  contents.on('will-redirect', (contentsEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [];

    // Log and prevent the app from redirecting to a new page
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${navigationUrl}'. This attempt was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  contents.on('will-attach-webview', (_, webPreferences) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;
  });

  contents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    const validOrigins = [];

    // Log and prevent opening up a new window
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to open a new window at the following address: '${url}'. This attempt was blocked.`
      );

      return {
        action: 'deny',
      };
    }

    return {
      action: 'allow',
    };
  });
});
