import { act, renderHook, waitFor } from "@testing-library/react";

import useSelectedImage from "./use-selected-image";

import readImageAsElement from "../../utils/read-image-as-element";

const readImageAsElementMock = readImageAsElement as jest.MockedFunction<
  typeof readImageAsElement
>;
jest.mock("../../utils/read-image-as-element", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      const img = new Image();
      img.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" +
        "AAAFCAYAAACNbyblAAAAHElEQVQI12P4" +
        "//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
      return Promise.resolve(img);
    }),
  };
});

describe("useSelectedImage", () => {
  it("should handle no file selected", async () => {
    const { result } = renderHook(() => useSelectedImage());
    const changeEvent = {
      target: {
        files: [],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    await result.current.onSelect(changeEvent);
    expect(result.current.image).toBeUndefined();
  });
  it("should ignore invalid file types", async () => {
    const { result } = renderHook(() => useSelectedImage());
    const file = new File(["(⌐□_□)"], "document.pdf", {
      type: "application/pdf",
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => result.current.onSelect(changeEvent));
    expect(result.current.image).toBeUndefined();
  });
  it("should handle PNG file selection", async () => {
    const { result } = renderHook(() => useSelectedImage());
    const file = new File(["(⌐□_□)"], "testfile.png", {
      type: "image/png",
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    await act(async () => result.current.onSelect(changeEvent));
    expect(readImageAsElementMock).toHaveBeenCalledWith(file);
    await waitFor(() =>
      expect(result.current.image).toBeInstanceOf(HTMLImageElement),
    );
  });

  it("should handle JPEG file selection", async () => {
    const { result } = renderHook(() => useSelectedImage());
    const file = new File(["(⌐□_□)"], "testfile.jpg", {
      type: "image/jpeg",
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    await act(async () => result.current.onSelect(changeEvent));
    expect(readImageAsElementMock).toHaveBeenCalledWith(file);
  });

  it("should handle GIF file selection", async () => {
    const { result } = renderHook(() => useSelectedImage());
    const file = new File(["(⌐□_□)"], "testfile.gif", {
      type: "image/gif",
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => result.current.onSelect(changeEvent));
    expect(readImageAsElementMock).toHaveBeenCalledWith(file);
  });

  it("should set image value", async () => {
    const { result } = renderHook(() => useSelectedImage());
    const file = new File(["(⌐□_□)"], "testfile.png", {
      type: "image/png",
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    await act(async () => result.current.onSelect(changeEvent));
    await waitFor(() =>
      expect(result.current.image).toBeInstanceOf(HTMLImageElement),
    );
  });
});
