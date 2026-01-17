import { MutableRefObject, useEffect } from "react";
import calculateSourceDimensions from "../../utils/calculate-source-dimensions";

export default function useCanvas(
  canvasReference: MutableRefObject<HTMLCanvasElement | null>,
  image?: HTMLImageElement,
) {
  useEffect(() => {
    if (!image || !canvasReference.current) {
      return;
    }
    const canvas = canvasReference.current;
    const ctx = canvas.getContext("2d");
    const [width, height] = calculateSourceDimensions(
      [canvas.width, canvas.height],
      [image.naturalWidth, image.naturalHeight],
    );
    if (!ctx) {
      throw new Error("No 2D context retrieved");
    }

    ctx.drawImage(
      image,
      0,
      0,
      width,
      height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }, [image]);
}
