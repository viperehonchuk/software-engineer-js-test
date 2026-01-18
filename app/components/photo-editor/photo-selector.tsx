import React, { useContext } from "react";

import { PhotoEditorStateContext } from "./state-context";
import useSelectedImage from "./use-selected-image";

export default function PhotoSelector() {
  const { setImage } = useContext(
    PhotoEditorStateContext,
  )!;
  const { onSelect } = useSelectedImage(setImage);
  return (
    <form>
      <label htmlFor="fileSelector">
        <span>Select an image</span>
        <input
          accept="image/png, image/jpeg, image/gif"
          data-testid="fileSelector"
          type="file"
          id="fileSelector"
          onChange={onSelect}
        />
      </label>
    </form>
  );
}
