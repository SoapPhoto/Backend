export const round = (value: number, decimalDigits = 0) => {
  const multiplier = Math.pow(10, decimalDigits);

  return Math.round(value * multiplier) / multiplier;
};
