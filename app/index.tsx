import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Application from './application';

const container = document.querySelector('#app');
const root = createRoot(container!);
root.render(
  <StrictMode>
    <Application />
  </StrictMode>,
);
