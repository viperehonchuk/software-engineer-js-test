export default function convertImageToBase64(
  image: HTMLImageElement,
  format: string = 'image/png',
): string {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('No 2D context retrieved');
  }
  context.drawImage(image, 0, 0);
  return canvas.toDataURL(format);
}
