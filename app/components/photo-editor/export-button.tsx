import React, { useCallback, useContext } from 'react';

import convertImageToBase64 from '../../utils/convert-image-to-base64';
import downloadAsJson from '../../utils/download-as-json';
import hashBase64 from '../../utils/hash-base64';

import { PhotoEditorStateContext } from './state-context';

export default function PhotoExportButton() {
  const { image, imageShift } = useContext(PhotoEditorStateContext)!;

  const handleExport = useCallback(() => {
    if (!image) {
      return;
    }
    const base64: string = convertImageToBase64(image);
    if (!base64) {
      throw new Error('No image to export');
    }
    // Create ID from image data
    const hashId = hashBase64(base64);
    const data = {
      canvas: {
        height: 10,
        photo: {
          height: image.naturalHeight / 50,
          id: hashId,
          src: base64,
          width: image.naturalHeight / 50,
          x: -imageShift[0] / 50,
          y: -imageShift[1] / 50,
        },
        width: 15,
      },
    };
    // Download JSON file
    const fileName = `exported-image-${hashId}.json`;
    downloadAsJson(data, fileName);
  }, [image, imageShift]);

  return (
    <button disabled={!image} onClick={handleExport} type="button">
      Export
    </button>
  );
}
