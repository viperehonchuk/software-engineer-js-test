import React from 'react';

import PhotoEditorCanvas from './canvas';
import PhotoConfigImport from './config-import';
import PhotoExportButton from './export-button';
import PhotoSelector from './photo-selector';

import styles from './index.module.css';

export const PhotoEditor = () => {
  return (
    <main className={styles.main}>
      <h1>Photo Editor</h1>
      <div style={{ display: 'flex' }}>
        <PhotoSelector />
        <PhotoConfigImport />
      </div>
      <PhotoEditorCanvas />
      <PhotoExportButton />
    </main>
  );
};
