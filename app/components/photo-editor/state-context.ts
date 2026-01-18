import { createContext } from 'react';

export interface PhotoEditorState {
  image: HTMLImageElement | null;
  imageShift: [number, number];
  imageScale: number;
  maxShift: [number, number];
}

export interface PhotoEditorStateAndSetters extends PhotoEditorState {
  restoreFromConfig: (image: HTMLImageElement, shift: [number, number]) => void;
  setImage: (image: HTMLImageElement) => void;
  setImageShift: (shift: [number, number]) => void;
}

export const PhotoEditorStateContext =
  createContext<PhotoEditorStateAndSetters | null>(null);
