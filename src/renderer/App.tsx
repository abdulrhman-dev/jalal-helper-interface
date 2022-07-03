import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConfigurePage from './components/ConfigurePage/ConfigurePage';
import DuplicateManger from './components/DuplicateManger';
import AppContextProvider from './providers/AppContextProvider';
import './App.css';

export default function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/configure" element={<ConfigurePage />} />
          <Route path="/duplicates" element={<DuplicateManger />} />
          <Route path="*" element={<Navigate to="/configure" />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}
