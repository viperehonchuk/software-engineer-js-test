export default function clampShift(
  imageShift: [number, number],
  maxShift: [number, number],
): [number, number] {
  const clampedX = Math.min(Math.max(imageShift[0], 0), maxShift[0]);
  const clampedY = Math.min(Math.max(imageShift[1], 0), maxShift[1]);
  return [clampedX, clampedY];
}
