const convert = require('color-convert');
const fs = require('fs');
const themes = require('./src/static/themes/themes.json');

themes.forEach((theme) => {
  const primary = convert.hex.hsl(theme.primary);
  const secondary = convert.hex.hsl(theme.secondary);
  const accent = convert.hex.hsl(theme.accent);

  const css = `
:root {
  --theme-primary-color-h: ${primary[0]};
  --theme-primary-color-s: ${primary[1]}%;
  --theme-primary-color-l: ${primary[2]}%;
  --theme-primary-color: hsl(
    var(--theme-primary-color-h),
    var(--theme-primary-color-s),
    var(--theme-primary-color-l)
  );

  --theme-secondary-color-h: ${secondary[0]};
  --theme-secondary-color-s: ${secondary[1]}%;
  --theme-secondary-color-l: ${secondary[2]}%;
  --theme-secondary-color: hsl(
    var(--theme-secondary-color-h),
    var(--theme-secondary-color-s),
    var(--theme-secondary-color-l)
  );

  --theme-accent-color-h: ${accent[0]};
  --theme-accent-color-s: ${accent[1]}%;
  --theme-accent-color-l: ${accent[2]}%;
  --theme-accent-color: hsl(
    var(--theme-accent-color-h),
    var(--theme-accent-color-s),
    var(--theme-accent-color-l)
  );
}
`.trim();

  fs.writeFileSync(`src/static/themes/${theme.file}`, css, 'utf8');
});
