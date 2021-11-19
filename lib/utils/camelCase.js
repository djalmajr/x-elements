export function camelCase(str) {
  return str.replace(/-(\w)/g, (_$0, $1) => $1.toUpperCase());
}
