export const getCssVariable = (variable: string) =>
  getComputedStyle(document.body).getPropertyValue(variable);
