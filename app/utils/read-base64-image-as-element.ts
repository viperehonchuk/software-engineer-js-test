export default function readBase64ImageAsElement(
  base64Data: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // create HTMLImageElement holding image data
    const img = new Image();
    img.src = base64Data;
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', () =>
      reject(new Error('Failed to load image')),
    );
  });
}
