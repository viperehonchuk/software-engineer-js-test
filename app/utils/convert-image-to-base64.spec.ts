import convertImageToBase64 from './convert-image-to-base64';

describe('convertImageToBase64', () => {
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    originalCreateElement = document.createElement.bind(document);
  });

  afterEach(() => {
    // restore original createElement in case any test replaced it
    jest
      .spyOn(document, 'createElement')
      .mockImplementation(originalCreateElement);
  });

  it('creates a canvas with image natural size, draws the image and returns the default png data URL', () => {
    const img = {
      naturalWidth: 100,
      naturalHeight: 50,
    } as unknown as HTMLImageElement;

    const fakeContext = {
      drawImage: jest.fn(),
    };

    const fakeCanvas: any = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => fakeContext),
      toDataURL: jest.fn(() => 'data:image/png;base64,TEST_PNG'),
    };

    jest
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) =>
        tagName === 'canvas' ? fakeCanvas : originalCreateElement(tagName),
      );

    const result = convertImageToBase64(img);

    expect(fakeCanvas.width).toBe(img.naturalWidth);
    expect(fakeCanvas.height).toBe(img.naturalHeight);
    expect(fakeCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(fakeContext.drawImage).toHaveBeenCalledWith(img, 0, 0);
    expect(fakeCanvas.toDataURL).toHaveBeenCalledWith('image/png');
    expect(result).toBe('data:image/png;base64,TEST_PNG');
  });

  it('passes the provided format through to toDataURL', () => {
    const img = {
      naturalWidth: 16,
      naturalHeight: 16,
    } as unknown as HTMLImageElement;

    const fakeContext = {
      drawImage: jest.fn(),
    };

    const fakeCanvas: any = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => fakeContext),
      toDataURL: jest.fn(() => 'data:image/jpeg;base64,TEST_JPEG'),
    };

    jest
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) =>
        tagName === 'canvas' ? fakeCanvas : originalCreateElement(tagName),
      );

    const result = convertImageToBase64(img, 'image/jpeg');

    expect(fakeCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg');
    expect(result).toBe('data:image/jpeg;base64,TEST_JPEG');
  });

  it('throws when no 2D context is retrieved', () => {
    const img = {
      naturalWidth: 10,
      naturalHeight: 10,
    } as unknown as HTMLImageElement;

    const fakeCanvas: any = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => null),
      toDataURL: jest.fn(),
    };

    jest
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) =>
        tagName === 'canvas' ? fakeCanvas : originalCreateElement(tagName),
      );

    expect(() => convertImageToBase64(img)).toThrow('No 2D context retrieved');
  });
});
