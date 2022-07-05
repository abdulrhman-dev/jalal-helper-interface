import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConfigurePage from './components/ConfigurePage/ConfigurePage';
import DuplicateManger from './components/DuplicateManger';
import AppContextProvider from './providers/AppContextProvider';
import './App.css';
import ToolSelector from './components/ToolSelector';

export default function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/selector" element={<ToolSelector />} />
          <Route path="/configureDuplicates" element={<ConfigurePage />} />
          <Route path="/duplicates" element={<DuplicateManger />} />
          <Route path="*" element={<Navigate to="/selector" />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}
