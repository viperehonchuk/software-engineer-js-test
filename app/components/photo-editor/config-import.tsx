import React, { useCallback, useContext } from 'react';
import * as v from 'valibot';

import { configSchema } from '../../schemata';
import readBase64ImageAsElement from '../../utils/read-base64-image-as-element';

import { PhotoEditorStateContext } from './state-context';

export default function PhotoConfigImport() {
  const { restoreFromConfig } = useContext(PhotoEditorStateContext)!;
  const handleSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      // read config file
      const files = event.target.files as FileList;
      if (files.length === 0) {
        return;
      }
      const file = files[0];
      try {
        const text = await file.text();
        const data = JSON.parse(text) as unknown;
        const config = v.parse(configSchema, data);
        const img = await readBase64ImageAsElement(config.canvas.photo.src);
        restoreFromConfig(img, [
          -config.canvas.photo.x * 50,
          -config.canvas.photo.y * 50,
        ]);
      } catch (error) {
        console.error('Failed to read configuration file', error);
        globalThis.alert('Failed to read configuration file');
        return;
      }
    },
    [restoreFromConfig],
  );
  return (
    <form>
      <label htmlFor="fileSelector">
        <span>Select a configuration file</span>
        <input
          accept="application/json"
          data-testid="configSelector"
          type="file"
          id="configSelector"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onChange={handleSelect}
        />
      </label>
    </form>
  );
}
