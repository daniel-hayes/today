export function setFontSize(size: number): void {
  const root = document.body;
  root.style.setProperty('--font-size', `${size.toString()}px`);
}
