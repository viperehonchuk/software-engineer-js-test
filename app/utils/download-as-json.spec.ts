/* eslint-disable @typescript-eslint/unbound-method */
import downloadAsJson from './download-as-json';

describe('downloadAsJson', () => {
  const originalCreateElement = document.createElement.bind(document);
  const originalBodyAppend = document.body.append.bind(document.body);
  const originalBlob = (globalThis as any).Blob;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // restore originals
    (globalThis as any).Blob = originalBlob;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    jest
      .spyOn(document, 'createElement')
      .mockImplementation(originalCreateElement);
    document.body.append = originalBodyAppend;
  });

  it('creates a JSON blob, creates an object URL, appends a link, clicks it, removes it and revokes the URL', () => {
    const data = { a: 1, b: 'two' };
    const fileName = 'test-file.json';
    const expectedJson = JSON.stringify(data, null, 2);

    // Spy/mocks
    let createdBlobParts: unknown[] | null = null;
    let createdBlobOptions: Record<string, unknown> | null = null;
    // Mock Blob constructor to capture parts/options
    (globalThis as any).Blob = function (
      parts: unknown[],
      options: Record<string, unknown>,
    ) {
      createdBlobParts = parts;
      createdBlobOptions = options;
      // return an opaque object that represents a blob
      return { __isFakeBlob: true };
    };

    const fakeHref = 'blob:fake-object-url';
    URL.createObjectURL = jest.fn(() => fakeHref);
    URL.revokeObjectURL = jest.fn();

    const order: string[] = [];
    // Fake link element
    const fakeLink: any = {
      href: '',
      download: '',
      click: jest.fn(() => order.push('click')),
      remove: jest.fn(() => order.push('remove')),
    };

    // Spy on createElement to return our fake link when asked for a canvas
    jest
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          return fakeLink;
        }
        return originalCreateElement(tagName);
      });

    // Spy on document.body.append to capture the append and record order
    document.body.append = jest.fn((_element: Node) => {
      order.push('append');
      // mimic native append (no-op)
      return undefined as unknown as void;
    });

    // Execute
    downloadAsJson(data, fileName);

    // Assertions about blob creation
    expect(createdBlobParts).not.toBeNull();
    // blob parts should contain the expected JSON string as first item
    expect(createdBlobParts![0]).toBe(expectedJson);
    expect(createdBlobOptions).toEqual({ type: 'application/json' });

    // URL.createObjectURL should be called with the blob object returned by our fake Blob
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledWith({ __isFakeBlob: true });

    // Link attributes set correctly
    expect(fakeLink.href).toBe(fakeHref);
    expect(fakeLink.download).toBe(fileName);

    // appended, clicked and removed
    expect(document.body.append).toHaveBeenCalledTimes(1);
    expect(document.body.append).toHaveBeenCalledWith(fakeLink);
    expect(fakeLink.click).toHaveBeenCalledTimes(1);
    expect(fakeLink.remove).toHaveBeenCalledTimes(1);

    // revokeObjectURL called with the href returned earlier
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(fakeHref);

    // Verify overall call order: append -> click -> remove -> revoke
    // Note: revoke is not an action on the DOM, but we recorded others; ensure sequence matches expectation
    // We recorded append/click/remove in `order`. Revoke we can assert ran after remove by checking mocks call order.
    expect(order).toEqual(['append', 'click', 'remove']);
    // Ensure revokeObjectURL was called after remove by inspecting mock invocation order
    const removeCallTime = (fakeLink.remove as jest.Mock).mock
      .invocationCallOrder[0];
    const revokeCallTime = (URL.revokeObjectURL as jest.Mock).mock
      .invocationCallOrder[0];
    expect(revokeCallTime).toBeGreaterThan(removeCallTime);
  });

  it('handles non-object data (e.g., array) and uses indentation of 2 spaces', () => {
    const data = [1, 2, 3];
    const fileName = 'arr.json';
    const expectedJson = JSON.stringify(data, null, 2);

    let createdBlobParts: unknown[] | null = null;
    (globalThis as any).Blob = function (
      parts: unknown[],
      _options: Record<string, unknown>,
    ) {
      createdBlobParts = parts;
      return {};
    };

    URL.createObjectURL = jest.fn(() => 'blob:url');
    URL.revokeObjectURL = jest.fn();

    const fakeLink: any = {
      href: '',
      download: '',
      click: jest.fn(),
      remove: jest.fn(),
    };
    jest
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) =>
        tagName === 'a' ? fakeLink : originalCreateElement(tagName),
      );
    document.body.append = jest.fn();

    downloadAsJson(data, fileName);

    expect(createdBlobParts).not.toBeNull();
    expect(createdBlobParts![0]).toBe(expectedJson);
    expect(fakeLink.download).toBe(fileName);
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});
