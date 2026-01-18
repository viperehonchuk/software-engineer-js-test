import { useCallback, useEffect, useRef } from "react";

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../constants";
import useWindowHandlers from "../../hooks/use-window-handers";
import moveImageShift from "../../utils/move-image-shift";

export default function useDraggedCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  fitRatio: number,
  image: HTMLImageElement | null,
  imageShift: [number, number],
  setImageShift: (newValue: [number, number]) => void,
) {
  const maxShiftX = image ? image.naturalWidth * fitRatio - CANVAS_WIDTH : 0;
  const maxShiftY = image ? image.naturalHeight * fitRatio - CANVAS_HEIGHT : 0;

  const { registerWindowHandler, unregisterWindowHandler } =
    useWindowHandlers();
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!image || !canvasRef.current) {
        return;
      }
      const initialImageShift: [number, number] = imageShift;
      const rect = canvasRef.current.getBoundingClientRect();
      const startX = event.clientX - rect.left;
      const startY = event.clientY - rect.top;

      const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
        setImageShift(
          moveImageShift(
            mouseMoveEvent.clientX - rect.left,
            mouseMoveEvent.clientY - rect.top,
            startX,
            startY,
            fitRatio,
            initialImageShift,
            maxShiftX,
            maxShiftY,
          ),
        );
      };
      registerWindowHandler("mousemove", handleMouseMove as EventListener);

      const handleMouseUp = () => {
        unregisterWindowHandler("mousemove", handleMouseMove as EventListener);
        unregisterWindowHandler("mouseup", handleMouseUp);
      };

      registerWindowHandler("mouseup", handleMouseUp);
    },
    [fitRatio, image, imageShift, maxShiftX, maxShiftY, setImageShift],
  );
  return { handleMouseDown };
}
