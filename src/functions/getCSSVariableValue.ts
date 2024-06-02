export function getCSSVariableValue(variableName: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}
