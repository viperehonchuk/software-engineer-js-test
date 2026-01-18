export default function clampShift(
  imageShift: [number, number],
  maxShiftX: number,
  maxShiftY: number,
): [number, number] {
  const clampedX = Math.min(Math.max(imageShift[0], 0), maxShiftX);
  const clampedY = Math.min(Math.max(imageShift[1], 0), maxShiftY);
  return [clampedX, clampedY];
}
