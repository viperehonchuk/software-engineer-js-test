import React from 'react';

import { PhotoEditor } from "./components/photo-editor";
import PhotoEditorStateProvider from "./components/photo-editor/state-provider";

export default function Application() {
  return (
    <PhotoEditorStateProvider>
      <PhotoEditor />
    </PhotoEditorStateProvider>
  );
}