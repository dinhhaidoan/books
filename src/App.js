import React from 'react';
import AppRoutes from './router/AppRoutes';
import { useTheme } from './hooks/useTheme';
import './styles/global.css';

function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="App">
      <AppRoutes isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
