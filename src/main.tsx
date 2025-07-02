import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'leaflet/dist/leaflet.css'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/courseitda-date-route">
    <App />
  </BrowserRouter>
);
