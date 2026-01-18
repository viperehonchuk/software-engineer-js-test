import drawImageToCanvas from "./draw-image-to-canvas";

const drawImageMock = jest.fn();

describe("drawImageToCanvas", () => {
  let canvas: HTMLCanvasElement;
  let image: HTMLImageElement;

  beforeEach(() => {
    canvas = {
      height: 600,
      width: 800,
      getContext: () => ({
        drawImage: drawImageMock,
      }),
    } as unknown as HTMLCanvasElement;
    image = {
      naturalHeight: 1200,
      naturalWidth: 1600,
    } as unknown as HTMLImageElement;
  });

  it("should draw the image to the canvas with correct dimensions", () => {
    drawImageToCanvas(image, canvas);
    expect(drawImageMock).toHaveBeenCalledWith(
      image,
      0,
      0,
      1600,
      1200,
      0,
      0,
      800,
      600,
    );
  });
  it("should throw an error if 2D context is not available", () => {
    const faultyCanvas = {
      height: 600,
      width: 800,
      getContext: () => null,
    } as unknown as HTMLCanvasElement;
    expect(() => drawImageToCanvas(image, faultyCanvas)).toThrow(
      "No 2D context retrieved",
    );
  });
});
