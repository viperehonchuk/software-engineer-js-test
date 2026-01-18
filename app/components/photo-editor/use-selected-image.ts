import { useCallback } from 'react';

import readImageAsElement from '../../utils/read-image-as-element';

/**
 * Enables to use a local image (<input /> file) as an HTML image
 * @returns An <input /> change handler setting that image
 */
export default function useSelectedImage(
  onSelect: (image: HTMLImageElement) => void,
) {
  const handleSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // get all selected Files
      const files = event.target.files as FileList;
      for (let index = 0, file = files[index]; index < files.length; ++index) {
        // check if file is valid Image (just a MIME check)
        switch (file.type) {
          case 'image/jpeg':
          case 'image/png':
          case 'image/gif': {
            // read Image contents from file
            readImageAsElement(file)
              .then((image) => {
                onSelect(image);
              })
              .catch((error) => {
                console.error('Failed to read image file', error);
                globalThis.alert('Failed to read image file');
              });
            break;
          }
          default: {
            // process just one file
            return;
          }
        }
      }
    },
    [],
  );
  return {
    onSelect: handleSelect,
  };
}
