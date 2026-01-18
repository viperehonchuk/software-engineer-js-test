import { useCallback } from "react";

import readImageAsElement from "../../utils/read-image-as-element";

/**
 * Enables to use a local image (<input /> file) as an HTML image
 * @returns An <input /> change handler setting that image
 */
export default function useSelectedImage(onSelect: (image: HTMLImageElement) => void) {
  const handleSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      // get all selected Files
      const files = e.target.files as FileList;
      for (let i = 0, file = files[i]; i < files.length; ++i) {
        // check if file is valid Image (just a MIME check)
        switch (file.type) {
          case "image/jpeg":
          case "image/png":
          case "image/gif":
            // read Image contents from file
            const image = await readImageAsElement(file);
            onSelect(image);
            break;
          default:
            // process just one file
            return;
        }
      }
    },
    [],
  );
  return {
    onSelect: handleSelect,
  };
}
