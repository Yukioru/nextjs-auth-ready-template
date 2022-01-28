export function getDefaultExpireTime() {
  const date = new Date();
  return new Date(date.setMonth(date.getMonth() + 1));
}
