import React, { useCallback, useContext, useEffect, useRef } from 'react';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../constants';
import useWindowHandlers from '../../hooks/use-window-handlers';
import drawImageToCanvas from '../../utils/draw-image-to-canvas';
import moveImageShift from '../../utils/move-image-shift';

import { PhotoEditorStateContext } from './state-context';

export default function PhotoEditorCanvas() {
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const { image, imageScale, imageShift, setImageShift } = useContext(
    PhotoEditorStateContext,
  )!;
  useEffect(() => {
    const canvas = canvasReference.current;
    if (!image || !canvas) {
      return;
    }
    drawImageToCanvas(image, canvas, imageShift);
  }, [image, imageShift]);

  const { registerWindowHandler, unregisterWindowHandler } =
    useWindowHandlers();
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!image || !canvasReference.current) {
        return;
      }
      const initialImageShift = imageShift;

      const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
        setImageShift(
          moveImageShift(
            mouseMoveEvent.clientX - event.clientX,
            mouseMoveEvent.clientY - event.clientY,
            imageScale,
            initialImageShift,
          ),
        );
      };
      registerWindowHandler('mousemove', handleMouseMove as EventListener);

      const handleMouseUp = () => {
        unregisterWindowHandler('mousemove', handleMouseMove as EventListener);
        unregisterWindowHandler('mouseup', handleMouseUp);
      };

      registerWindowHandler('mouseup', handleMouseUp);
    },
    [
      image,
      imageScale,
      imageShift,
      registerWindowHandler,
      setImageShift,
      unregisterWindowHandler,
    ],
  );
  return (
    <fieldset>
      <legend>Drag the image to shift it</legend>
      <canvas
        ref={canvasReference}
        data-testid="image-canvas"
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        width={CANVAS_WIDTH}
      />
    </fieldset>
  );
}
