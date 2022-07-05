import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConfigurePage from './pages/ConfigurePage/ConfigurePage';
import DuplicateManger from './pages/DuplicateManger';
import AppContextProvider from './providers/AppContextProvider';
import ToolSelector from './pages/ToolSelector';
import TitleBar from './components/TitleBar/Titlebar';
import DuplicateSuccess from './pages/DuplicateSuccess';

export default function App() {
  return (
    <AppContextProvider>
      <TitleBar title="Jalal Helper" />
      <BrowserRouter>
        <Routes>
          <Route path="/selector" element={<ToolSelector />} />
          <Route path="/configureDuplicates" element={<ConfigurePage />} />
          <Route path="/duplicates" element={<DuplicateManger />} />
          <Route path="/duplicateSuccess" element={<DuplicateSuccess />} />
          <Route path="*" element={<Navigate to="/selector" />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}
