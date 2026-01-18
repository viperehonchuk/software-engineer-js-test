export default function convertImageToBase64(
    image: HTMLImageElement,
    format: string = "image/png",
  ): string {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2D context retrieved");
    }
    ctx.drawImage(image, 0, 0);
    return canvas.toDataURL(format);
  }