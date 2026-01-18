export default function readBase64ImageAsElement(
  base64Data: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // create HTMLImageElement holding image data
    const img = new Image();
    img.src = base64Data;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}
