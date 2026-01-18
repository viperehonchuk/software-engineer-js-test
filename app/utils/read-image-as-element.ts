export default function readImageAsElement(
  file: File,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', (_event: ProgressEvent<FileReader>) => {
      // create HTMLImageElement holding image data
      const img = new Image();
      img.src = reader.result as string;
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', () =>
        reject(new Error('Failed to load image')),
      );
    });
    reader.readAsDataURL(file);
  });
}
