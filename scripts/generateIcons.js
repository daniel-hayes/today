const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const icongen = require('icon-gen');

const imgSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

const directories = {
  png: 'png',
  mac: 'mac',
  windows: 'windows',
};

const entry = path.join(__dirname, '..', '/src/static/build');
const input = `${entry}/original-icon.png`;
const output = `${entry}/icons`;
const png = `${output}/${directories.png}/`;
const macDir = path.join(output, directories.mac);
const winDir = path.join(output, directories.windows);

function setupDirectories() {
  if (fs.existsSync(output)) {
    fs.rmdirSync(output, { recursive: true });
  }

  // make dir if does not exist
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  // make dir if does not exist
  if (!fs.existsSync(png)) {
    fs.mkdirSync(png);
  }

  // make dir if does not exist
  if (!fs.existsSync(macDir)) {
    fs.mkdirSync(macDir);
  }

  // make dir if does not exist
  if (!fs.existsSync(winDir)) {
    fs.mkdirSync(winDir);
  }
}

async function createIcons() {
  for (const size of imgSizes) {
    const fileName = `${size}.png`;

    console.log(`Creating ${fileName}`);

    try {
      const image = await Jimp.read(input);
      image.resize(size, size).write(png + fileName);
    } catch (e) {
      console.error(e);
    }
  }

  await icongen(png, macDir, {
    report: false,
    icns: {
      name: 'icon',
      sizes: [16, 32, 64, 128, 256, 512, 1024],
    },
  });

  await icongen(png, winDir, {
    report: false,
    ico: {
      name: 'icon',
      sizes: [16, 24, 32, 48, 64, 128, 256],
    },
  });

  const files = fs.readdirSync(png);
  files.forEach((file) => {
    const size = file.split('.png')[0];
    fs.renameSync(`${png}${file}`, `${png}${size}x${size}.png`);
  });
}

setupDirectories();
createIcons();
