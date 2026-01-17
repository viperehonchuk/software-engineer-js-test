import React from "react";
import { useRef } from "react";
import useCanvas from "./use-canvas";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../constants";
import styles from "./index.module.css";
import useDynamicImage from "./use-dynamic-image";

export const PhotoEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { image, onSelect } = useDynamicImage();

  useCanvas(canvasRef, image);

  return (
    <main className={styles.main}>
      <h1>Photo Editor</h1>
      <form>
        <label htmlFor="fileSelector">
          <span>Select an image</span>
          <input
            accept="image/png, image/jpeg, image/gif"
            type="file"
            id="fileSelector"
            onChange={onSelect}
          />
        </label>
      </form>
      <canvas ref={canvasRef} height={CANVAS_HEIGHT} width={CANVAS_WIDTH} />
    </main>
  );
};
