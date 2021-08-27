#!/usr/bin / env node

const fs = require('fs');
const inquirer = require('inquirer');
// @TODO update this path
const themes = require('../src/static/app/themes/themes.json');

const inquire = () => {
  const questions = [
    {
      name: 'colors',
      type: 'input',
      message:
        'Comma separated list of hex values in CSV format: (primary, secondary, accent)',
      filter: (colors) => {
        const hexColors = Array.isArray(colors) ? colors : colors.split(',');

        const [primary, secondary, accent] = hexColors.map((hex) => {
          const trimmedHex = hex.trim();
          return trimmedHex.startsWith('#') ? trimmedHex : `#${trimmedHex}`;
        });

        return { primary, secondary, accent };
      },
    },
    {
      name: 'name',
      type: 'input',
      message: 'Name of the theme',
      filter: (name) => {
        return {
          title: name,
          file: `${name.replace(/\s+/g, '-').toLowerCase()}.css`,
        };
      },
    },
  ];
  return inquirer.prompt(questions);
};

(async () => {
  const { colors, name } = await inquire();

  themes.push({ ...colors, ...name });

  const data = JSON.stringify(
    themes.sort((a, b) => (a.title > b.title ? 1 : -1)),
    null,
    2
  );

  fs.writeFileSync(`${__dirname}/../src/static/app/themes/themes.json`, data);

  console.log(`themes.json updated with new theme`);
})();
