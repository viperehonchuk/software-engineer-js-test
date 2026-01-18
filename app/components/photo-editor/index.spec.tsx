import { render } from "@testing-library/react";
import React from "react";
import { PhotoEditor } from ".";
import PhotoEditorStateProvider from "./state-provider";

const onSelectMock = jest.fn();

jest.mock("./use-selected-image", () => {
  return {
    __esModule: true,
    default: () => ({
      image: undefined,
      onSelect: onSelectMock,
    }),
  };
});
jest.mock('./config-import', () => {
  return {
    __esModule: true,
    default: () => <div>ConfigImportMock</div>,
  };
});

describe("PhotoEditor", () => {
  it("should have all required components", () => {
    const { queryByTestId, queryByText } = render(<PhotoEditor />, {wrapper: PhotoEditorStateProvider});
    expect(queryByText("Photo Editor")).toBeTruthy();
    expect(queryByTestId("fileSelector")).toBeTruthy();
    expect(queryByTestId("image-canvas")).toBeTruthy();
  });

  it("responds to input change event", () => {
    const { queryByTestId } = render(<PhotoEditor />, {wrapper: PhotoEditorStateProvider});
    const fileInput = queryByTestId("fileSelector") as HTMLInputElement;
    const changeEvent = new Event("change", { bubbles: true });
    fileInput.dispatchEvent(changeEvent);
    expect(onSelectMock).toHaveBeenCalled();
  });
});
