export default function readImageAsElement(
  file: File,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      // create HTMLImageElement holding image data
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    };
    reader.readAsDataURL(file);
  });
}
