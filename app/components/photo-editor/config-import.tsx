import React, { useCallback, useContext } from "react";
import * as v from "valibot";

import { configSchema } from "../../schemata";
import readBase64ImageAsElement from "../../utils/read-base64-image-as-element";

import { PhotoEditorStateContext } from "./state-context";

export default function PhotoConfigImport() {
  const { restoreFromConfig } = useContext(PhotoEditorStateContext)!;
  const handleSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // read config file
      const files = event.target.files as FileList;
      if (files.length === 0) {
        return;
      }
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        try {
          const data = JSON.parse(
            loadEvent.target?.result as string,
          ) as unknown;
          const config = v.parse(configSchema, data);
          const img = await readBase64ImageAsElement(config.canvas.photo.src);
          restoreFromConfig(img, [
            -config.canvas.photo.x * 50,
            -config.canvas.photo.y * 50,
          ]);

          // handle other config parameters as needed
        } catch (error) {
          console.error("Invalid configuration file", error);
          window.alert("Invalid configuration file");
        }
      };
      reader.readAsText(file);
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
          onChange={handleSelect}
        />
      </label>
    </form>
  );
}
