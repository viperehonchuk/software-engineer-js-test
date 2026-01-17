/**
 * Calculates [width, height] of a source image to be actually drawn
 *
 * @param canvasDimensions Full dimensions of the canvas
 * @param imageDimensions Full dimensions of the source image
 */
export default function calculateSourceDimensions(
  canvasDimensions: [number, number],
  imageDimensions: [number, number],
): [number, number] {
  const canvasRatio = canvasDimensions[0] / canvasDimensions[1];
  const imageRatio = imageDimensions[0] / imageDimensions[1];
  let height = imageDimensions[1],
    width = imageDimensions[0];
  if (imageRatio > canvasRatio) {
    // fit all height
    width = height * canvasRatio;
  } else {
    // fit all width
    height = width / canvasRatio;
  }
  return [width, height];
}
