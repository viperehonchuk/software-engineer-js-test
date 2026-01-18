export default function hashBase64(base64Data: string): string {
  let hash = 0;
  for (let index = 0; index < base64Data.length; index++) {
    const char = base64Data.codePointAt(index);
    if (char === undefined) continue;
    hash = (hash << 5) - hash + char;
    hash = Math.trunc(hash); // Convert to 32bit integer
  }
  return hash.toString(16);
}
