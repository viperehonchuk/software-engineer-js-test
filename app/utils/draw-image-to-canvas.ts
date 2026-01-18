import calculateSourceDimensions from "./calculate-source-dimensions";

export default function drawImageToCanvas(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  imageShift: [number, number] = [0, 0],
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2D context retrieved");
  }
  const [width, height] = calculateSourceDimensions(
    [canvas.width, canvas.height],
    [image.naturalWidth, image.naturalHeight],
  );
  const sourceShift: [number, number] = [
    imageShift[0] * (image.naturalWidth / canvas.width),
    imageShift[1] * (image.naturalHeight / canvas.height),
  ];

  ctx.drawImage(
    image,
    ...sourceShift,
    width,
    height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
}
