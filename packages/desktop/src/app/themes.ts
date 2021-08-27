import * as convert from 'color-convert';
import type { Theme, Variant } from './store/state';
const themes = require('@today/shared/themes/themes.json');

type ThemeJSON = Theme[];

type CustomColor = {
  h: string;
  s: string;
  l: string;
  hsl: [string, string, string];
  hex: string;
};

type ColorVariants = {
  [Property in Variant]: CustomColor;
};

export const variants: Variant[] = ['primary', 'secondary', 'accent'];

function getCSSVars(variant: string): [string, string, string] {
  return [
    `--theme-${variant}-color-h`,
    `--theme-${variant}-color-s`,
    `--theme-${variant}-color-l`,
  ];
}

export function getThemes(): ThemeJSON {
  return themes as ThemeJSON;
}

export function getColorsFromCSS(): ColorVariants {
  const colorVariants: ColorVariants = {
    primary: {} as CustomColor,
    secondary: {} as CustomColor,
    accent: {} as CustomColor,
  };

  const computedStyle = getComputedStyle(document.body);

  for (const variant in colorVariants) {
    const [hVar, sVar, lVar] = getCSSVars(variant);
    const h = computedStyle.getPropertyValue(hVar).trim();
    const s = computedStyle.getPropertyValue(sVar).trim();
    const l = computedStyle.getPropertyValue(lVar).trim();

    colorVariants[variant] = {
      h,
      s,
      l,
      hsl: [h, s, l],
      hex: convertHSLToHex([h, s, l]),
    };
  }

  return colorVariants;
}

export function updateCSSVars(variant: string, hex: string): void {
  const root = document.documentElement;
  const [h, s, l] = convert.hex.hsl(hex);
  const [hVar, sVar, lVar] = getCSSVars(variant);
  root.style.setProperty(hVar, h.toString());
  root.style.setProperty(sVar, `${s}%`);
  root.style.setProperty(lVar, `${l}%`);
}

export function resetCustomThemeFromDOM(): void {
  document.documentElement.removeAttribute('style');
}

export function convertHSLToHex(hsl: [string, string, string]): string {
  const [h, s, l] = hsl;

  // strip percent sign if it exists.
  // this conforms to the color-convert format
  const toHSL = (v: string) => Number(v.replace('%', ''));

  return `#${convert.hsl.hex([toHSL(h), toHSL(s), toHSL(l)])}`;
}
