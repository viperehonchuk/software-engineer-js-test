import calculateMaxShift from './calculate-max-shift';

jest.mock('../constants', () => ({
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
}));

describe('calculateMaxShift', () => {
  it('returns a y-shift (x shift = 0) when xScale > yScale', () => {
    // width small relative to canvas so xScale > yScale
    const [xShift, yShift] = calculateMaxShift(200, 300);

    // Manual calculation for these inputs with CANVAS_WIDTH=800, CANVAS_HEIGHT=600:
    // xScale = 800 / 200 = 4
    // yScale = 600 / 300 = 2
    // yShift = (300 - (600/800) * 200) * 2 = (300 - 0.75*200) * 2 = (300 - 150) * 2 = 150 * 2 = 300
    expect(xShift).toBeCloseTo(0);
    expect(yShift).toBeCloseTo(300);
    expect([xShift, yShift]).toEqual([0, 300]);
  });

  it('returns an x-shift (y shift = 0) when xScale < yScale', () => {
    // width large relative to canvas so xScale < yScale
    const [xShift, yShift] = calculateMaxShift(1600, 600);

    // Manual calculation:
    // xScale = 800 / 1600 = 0.5
    // yScale = 600 / 600 = 1
    // xShift = (1600 - (800/600) * 600) * 0.5 = (1600 - 1.3333333*600) * 0.5 = (1600 - 800) * 0.5 = 800 * 0.5 = 400
    expect(xShift).toBeCloseTo(400);
    expect(yShift).toBeCloseTo(0);
    expect([xShift, yShift]).toEqual([400, 0]);
  });

  it('returns zero shifts when scales are exactly equal', () => {
    // width/height producing equal scales: xScale = yScale
    const [xShift, yShift] = calculateMaxShift(400, 300);

    // xScale = 800/400 = 2, yScale = 600/300 = 2 => equal -> else branch but arithmetic yields zero
    expect(xShift).toBeCloseTo(0);
    expect(yShift).toBeCloseTo(0);
    expect([xShift, yShift]).toEqual([0, 0]);
  });

  it('works with non-standard canvas sizes (sanity check)', () => {
    const [xShift, yShift] = calculateMaxShift(512, 384);

    // For these values xScale = 1024/512 = 2, yScale = 768/384 = 2 -> equal -> zero shifts
    expect([xShift, yShift]).toEqual([0, 0]);
  });
});
