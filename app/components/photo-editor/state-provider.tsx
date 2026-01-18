import React, { type ReactNode, useCallback, useReducer } from "react";

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../constants";
import useThrottledCallback from "../../hooks/use-throttled-callback";
import clampShift from "../../utils/clamp-shift";

import {
  type PhotoEditorState,
  PhotoEditorStateContext,
} from "./state-context";
import calculateMaxShift from "../../utils/calculate-max-shift";

export interface RestoreFromConfigAction {
  type: "RESTORE_FROM_CONFIG";
  image: HTMLImageElement;
  shift: [number, number];
}

export interface SetImageAction {
  type: "SET_IMAGE";
  image: HTMLImageElement;
}

export interface SetImageShiftAction {
  type: "SET_IMAGE_SHIFT";
  shift: [number, number];
}

export default function PhotoEditorStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    (
      oldState: PhotoEditorState,
      action: RestoreFromConfigAction | SetImageAction | SetImageShiftAction,
    ) => {
      switch (action.type) {
        // Define your state transitions here
        case "RESTORE_FROM_CONFIG": {
          const imageScale = Math.max(
            CANVAS_WIDTH / action.image.naturalWidth,
            CANVAS_HEIGHT / action.image.naturalHeight,
          );
          const maxShift: [number, number] = calculateMaxShift(
            action.image.naturalWidth,
            action.image.naturalHeight);
          return {
            ...oldState,
            image: action.image,
            imageScale,
            imageShift: action.shift,
            maxShift,
          };
        }
        case "SET_IMAGE": {
          const imageScale = Math.max(
            CANVAS_WIDTH / action.image.naturalWidth,
            CANVAS_HEIGHT / action.image.naturalHeight,
          );
          const maxShift: [number, number] = calculateMaxShift(
            action.image.naturalWidth,
            action.image.naturalHeight);
          return {
            ...oldState,
            image: action.image,
            imageScale,
            imageShift: [0, 0] as [number, number],
            maxShift,
          };
        }
        case "SET_IMAGE_SHIFT":
          return {
            ...oldState,
            imageShift: clampShift(action.shift, oldState.maxShift),
          };
        default:
          return oldState;
      }
    },
    { image: null, imageShift: [0, 0], imageScale: 1, maxShift: [0, 0] },
  );

  const restoreFromConfig = useCallback(
    (image: HTMLImageElement, shift: [number, number]) => {
      dispatch({ type: "RESTORE_FROM_CONFIG", image, shift });
    },
    [],
  );

  const setImage = useCallback((image: HTMLImageElement) => {
    dispatch({ type: "SET_IMAGE", image });
  }, []);

  const setImageShift = useThrottledCallback((shift: [number, number]) => {
    dispatch({ type: "SET_IMAGE_SHIFT", shift });
  }, 20);

  return (
    // Provide state to children components
    <PhotoEditorStateContext.Provider
      value={{ ...state, restoreFromConfig, setImage, setImageShift }}
    >
      {children}
    </PhotoEditorStateContext.Provider>
  );
}
