export function capitalizeFirstLetter(data: string | undefined) {
  if (!data) return '';
  return data[0].toUpperCase() + data.slice(1);
}
