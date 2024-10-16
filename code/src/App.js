import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);  // Alternar entre abrir/cerrar el Sidebar
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar isOpen={isOpen} handleDrawerToggle={handleDrawerToggle} />
      <div style={{ flex: 1, padding: '20px' }}>
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
}

export default App;
