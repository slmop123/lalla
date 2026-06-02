import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSchoolData } from './lib/schoolData.ts';

// Initialize the Lalla Asmaa school offline database keys in LocalStorage
initSchoolData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
