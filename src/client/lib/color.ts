function subtractLight(color: string, amount: number): string {
  let darkerColorNumber = parseInt(color, 16) - amount;
  darkerColorNumber = darkerColorNumber < 0 ? 0 : darkerColorNumber;
  return darkerColorNumber.toString(16).length > 1
    ? darkerColorNumber.toString(16)
    : `0${darkerColorNumber.toString(16)}`;
}

export function darken(color: string, amount = 20): string {
  color = color.includes('#') ? color.substring(1, color.length) : color;
  amount = (255 * amount) / 100;
  return (color = `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount
  )}${subtractLight(color.substring(4, 6), amount)}`);
}

function addLight(color: string, amount: number): string {
  let lighterColorNumber = parseInt(color, 16) + amount;
  lighterColorNumber = lighterColorNumber > 255 ? 255 : lighterColorNumber;
  return lighterColorNumber.toString(16).length > 1
    ? lighterColorNumber.toString(16)
    : `0${lighterColorNumber.toString(16)}`;
}

export function lighten(color: string, amount = 20): string {
  color = color.includes('#') ? color.substring(1, color.length) : color;
  amount = (255 * amount) / 100;
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`;
}
