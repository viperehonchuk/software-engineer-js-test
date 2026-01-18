export default function moveImageShift(
  deltaX: number,
  deltaY: number,
  fitRatio: number,
  initialImageShift: [number, number],
): [number, number] {
  const scaledDeltaX = deltaX * fitRatio;
  const scaledDeltaY = deltaY * fitRatio;
  return [
    initialImageShift[0] - scaledDeltaX,
    initialImageShift[1] - scaledDeltaY,
  ];
}
