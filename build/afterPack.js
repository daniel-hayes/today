const fs = require('fs');
const path = require('path');

// I don't know why I need to do this.
// I must be missing something in my config.
// https://github.com/electron-userland/electron-builder/issues/3196
module.exports = function ({ appOutDir, packager, electronPlatformName }) {
  if (electronPlatformName === 'darwin') {
    const unpackFileDir = path.join(
      appOutDir,
      `/${packager.appInfo.productFilename}.app/Contents/Resources/app.asar.unpacked`
    );

    if (fs.existsSync(unpackFileDir)) {
      fs.rmdirSync(unpackFileDir, { recursive: true });
    }
  }
};
