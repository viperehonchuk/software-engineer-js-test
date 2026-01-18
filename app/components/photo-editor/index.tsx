import React, { useEffect } from "react";
import { useRef } from "react";

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../constants";
import drawImageToCanvas from "../../utils/draw-image-to-canvas";

import styles from "./index.module.css";
import useSelectedImage from "./use-selected-image";

export const PhotoEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { image, onSelect } = useSelectedImage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!image || !canvas) {
      return;
    }
    drawImageToCanvas(image, canvas);
  }, [image]);

  return (
    <main className={styles.main}>
      <h1>Photo Editor</h1>
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
      <canvas
        ref={canvasRef}
        data-testid="image-canvas"
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
      />
    </main>
  );
};
