import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";

export default function calculateMaxShift(
  width: number,
  height: number,
): [number, number] {
  const xScale = CANVAS_WIDTH / width;
  const yScale = CANVAS_HEIGHT / height;
  if (xScale > yScale) {
    const scaledHeight = height * xScale;
    return [0, (height - CANVAS_HEIGHT / CANVAS_WIDTH * width) * yScale];
  } else {
    const scaledWidth = width * yScale;
    return [(width - CANVAS_WIDTH / CANVAS_HEIGHT * height) * xScale, 0];
  }
}
