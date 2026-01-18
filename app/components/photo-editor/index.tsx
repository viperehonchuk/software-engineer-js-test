import React, { useCallback, useEffect, useState } from "react";
import { useRef } from "react";

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../constants";
import useStateThrottled from "../../hooks/use-state-throttled";
import drawImageToCanvas from "../../utils/draw-image-to-canvas";

import styles from "./index.module.css";
import useSelectedImage from "./use-selected-image";
import useDraggedCanvas from "./use-dragged-canvas";

export const PhotoEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { image, onSelect } = useSelectedImage();
  const [imageShift, setImageShift] = useStateThrottled<[number, number]>(
    [0, 0],
    20,
  );
  const [fitRatio, setFitRatio] = useState<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!image || !canvas) {
      return;
    }
    const newFitRatio = drawImageToCanvas(image, canvas, imageShift);
    setFitRatio(newFitRatio);
  }, [image, imageShift]);

  const { handleMouseDown } = useDraggedCanvas(
    canvasRef,
    fitRatio,
    image || null,
    imageShift,
    setImageShift,
  )

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
        onMouseDown={handleMouseDown}
        width={CANVAS_WIDTH}
      />
    </main>
  );
};
