import clampShift from "./clamp-shift";

export default function moveImageShift(
  currentX: number,
  currentY: number,
  startX: number,
  startY: number,
  fitRatio: number,
  initialImageShift: [number, number],
  maxShiftX: number,
  maxShiftY: number,
): [number, number] {
  const deltaX = (currentX - startX) * fitRatio;
  const deltaY = (currentY - startY) * fitRatio;
  return clampShift(
    [initialImageShift[0] - deltaX, initialImageShift[1] - deltaY],
    maxShiftX * fitRatio,
    maxShiftY * fitRatio,
  );
}
