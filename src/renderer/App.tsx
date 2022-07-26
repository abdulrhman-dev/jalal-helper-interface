import './App.css';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import TitleBar from './components/TitleBar/Titlebar';
import ConfigurePage from './pages/DuplicateManger/DuplicateConfigurePage';
import DuplicateManger from './pages/DuplicateManger/DuplicateManger';
import AppContextProvider from './providers/AppContextProvider';
import ToolSelector from './pages/ToolSelector';
import DuplicateSuccess from './pages/DuplicateManger/DuplicateSuccess';
import PhoneConfigurePage from './pages/PhoneAppend/PhoneConfigurePage';
import PhoneSuccess from './pages/PhoneAppend/PhoneSuccess';

export default function App() {
  return (
    <AppContextProvider>
      <TitleBar title="Jalal Helper" />
      <HashRouter>
        <Routes>
          <Route path="duplicate">
            <Route path="configure" element={<ConfigurePage />} />
            <Route path="value" element={<DuplicateManger />} />
            <Route path="success" element={<DuplicateSuccess />} />
          </Route>
          <Route path="phone">
            <Route path="configure" element={<PhoneConfigurePage />} />
            <Route path="success" element={<PhoneSuccess />} />
          </Route>
          <Route path="/selector" element={<ToolSelector />} />
          <Route path="*" element={<Navigate to="/selector" />} />
        </Routes>
      </HashRouter>
    </AppContextProvider>
  );
}
