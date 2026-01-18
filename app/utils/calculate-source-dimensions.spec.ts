import calculateSourceDimensions from './calculate-source-dimensions';

describe('calculateSourceDimensions', () => {
  it('should return correct dimensions when image is wider than canvas', () => {
    const canvasDimensions: [number, number] = [800, 600];
    const imageDimensions: [number, number] = [1600, 600];
    const [width, height] = calculateSourceDimensions(
      canvasDimensions,
      imageDimensions,
    );
    expect(width).toBe(800);
    expect(height).toBe(600);
  });

  it('should return correct dimensions when image is taller than canvas', () => {
    const canvasDimensions: [number, number] = [800, 600];
    const imageDimensions: [number, number] = [800, 1200];
    const [width, height] = calculateSourceDimensions(
      canvasDimensions,
      imageDimensions,
    );
    expect(width).toBe(800);
    expect(height).toBe(600);
  });

  it('should return original dimensions when aspect ratios are equal', () => {
    const canvasDimensions: [number, number] = [800, 600];
    const imageDimensions: [number, number] = [1600, 1200];
    const [width, height] = calculateSourceDimensions(
      canvasDimensions,
      imageDimensions,
    );
    expect(width).toBe(1600);
    expect(height).toBe(1200);
  });

  it('should scale down large images correctly', () => {
    const canvasDimensions: [number, number] = [400, 300];
    const imageDimensions: [number, number] = [1600, 1200];
    const [width, height] = calculateSourceDimensions(
      canvasDimensions,
      imageDimensions,
    );
    expect(width).toBe(1600);
    expect(height).toBe(1200);
  });

  it('should scale up small images correctly', () => {
    const canvasDimensions: [number, number] = [1600, 1200];
    const imageDimensions: [number, number] = [800, 600];
    const [width, height] = calculateSourceDimensions(
      canvasDimensions,
      imageDimensions,
    );
    expect(width).toBe(800);
    expect(height).toBe(600);
  });

  it('should cut tall images correctly', () => {
    const canvasDimensions: [number, number] = [800, 600];
    const imageDimensions: [number, number] = [800, 2000];
    const [width, height] = calculateSourceDimensions(
      canvasDimensions,
      imageDimensions,
    );
    expect(width).toBe(800);
    expect(height).toBeCloseTo(600);
  });

  it('should cut wide images correctly', () => {
    const canvasDimensions: [number, number] = [800, 600];
    const imageDimensions: [number, number] = [2000, 600];
    const [width, height] = calculateSourceDimensions(
      canvasDimensions,
      imageDimensions,
    );
    expect(width).toBeCloseTo(800);
    expect(height).toBe(600);
  });

  it('should cut tall images with non-integer scaling', () => {
    const canvasDimensions: [number, number] = [750, 500];
    const imageDimensions: [number, number] = [800, 2000];
    const [width, height] = calculateSourceDimensions(
      canvasDimensions,
      imageDimensions,
    );
    expect(width).toBeCloseTo(800);
    expect(height).toBeCloseTo(533.33);
  });

  it('should cut wide images with non-integer scaling', () => {
    const canvasDimensions: [number, number] = [750, 500];
    const imageDimensions: [number, number] = [2000, 600];
    const [width, height] = calculateSourceDimensions(
      canvasDimensions,
      imageDimensions,
    );
    expect(width).toBeCloseTo(900);
    expect(height).toBeCloseTo(600);
  });
});
