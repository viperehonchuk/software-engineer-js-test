import calculateSourceDimensions from "./calculate-source-dimensions";

describe('calculateSourceDimensions', () => {
    it('should return correct dimensions when image is wider than canvas', () => {
        const canvasDimensions: [number, number] = [800, 600];
        const imageDimensions: [number, number] = [1600, 600];
        const [width, height] = calculateSourceDimensions(canvasDimensions, imageDimensions);
        expect(width).toBe(800);
        expect(height).toBe(600);
    });

    it('should return correct dimensions when image is taller than canvas', () => {
        const canvasDimensions: [number, number] = [800, 600];
        const imageDimensions: [number, number] = [800, 1200];
        const [width, height] = calculateSourceDimensions(canvasDimensions, imageDimensions);
        expect(width).toBe(800);
        expect(height).toBe(600);
    });

    it('should return original dimensions when aspect ratios are equal', () => {
        const canvasDimensions: [number, number] = [800, 600];
        const imageDimensions: [number, number] = [1600, 1200];
        const [width, height] = calculateSourceDimensions(canvasDimensions, imageDimensions);
        expect(width).toBe(1600);
        expect(height).toBe(1200);
    });
});