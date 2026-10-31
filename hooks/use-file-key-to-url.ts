export function useFileKeyToUrl(key?: string | null): string {
  if (!key || typeof key !== "string" || key.trim() === "") {
    return "/clario.png";
  }
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }
  return `https://clario.t3.storage.dev/${key}`;
}
