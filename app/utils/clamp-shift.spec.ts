import clampShift from './clamp-shift';

describe('clampShift', () => {
  it('clamps negative image shifts to 0 on both axes', () => {
    const imageShift: [number, number] = [-50, -10];
    const maxShift: [number, number] = [100, 100];

    const result = clampShift(imageShift, maxShift);
    expect(result).toEqual([0, 0]);
  });

  it('clamps image shifts that exceed maxShift down to the max', () => {
    const imageShift: [number, number] = [250.5, 300];
    const maxShift: [number, number] = [200, 250];

    const result = clampShift(imageShift, maxShift);
    expect(result).toEqual([200, 250]);
  });

  it('returns the original shift when inside the allowed range', () => {
    const imageShift: [number, number] = [50, 75];
    const maxShift: [number, number] = [200, 100];

    const result = clampShift(imageShift, maxShift);
    expect(result).toEqual([50, 75]);
  });

  it('returns [0,0] when maxShift is [0,0] regardless of imageShift', () => {
    const imageShift: [number, number] = [10, 20];
    const maxShift: [number, number] = [0, 0];

    const result = clampShift(imageShift, maxShift);
    expect(result).toEqual([0, 0]);
  });

  it('does not mutate the input arrays', () => {
    const imageShift: [number, number] = [10, -10];
    const maxShift: [number, number] = [5, 5];

    const imageShiftCopy = [...imageShift] as [number, number];
    const maxShiftCopy = [...maxShift] as [number, number];

    const result = clampShift(imageShift, maxShift);
    // ensure returned value is correct
    expect(result).toEqual([5, 0]);
    // ensure inputs unchanged
    expect(imageShift).toEqual(imageShiftCopy);
    expect(maxShift).toEqual(maxShiftCopy);
  });

  it('handles negative maxShift values (function behaviour is deterministic)', () => {
    // Note: while uncommon, if maxShift is negative the function will return the negative max
    const imageShift: [number, number] = [10, 10];
    const maxShift: [number, number] = [-5, -2];

    const result = clampShift(imageShift, maxShift);
    // Math.min(Math.max(10,0), -5) => Math.min(10, -5) => -5
    // Math.min(Math.max(10,0), -2) => -2
    expect(result).toEqual([-5, -2]);
  });
});
