import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import FoodRequests from './components/FoodRequest';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Controla si el usuario está autenticado
    const [isOpen, setIsOpen] = useState(false); // Controla el estado del Sidebar

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen); // Alterna el estado de apertura/cierre del Sidebar
    };

    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Routes>
                    {/* Ruta por defecto: siempre redirige a Login primero */}
                    <Route path="/" element={<Navigate to="/login" />} />
                    
                    {/* Ruta de Login */}
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />

                    {/* Rutas protegidas: Dashboard y FoodRequests */}
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated ? (
                                <>
                                    <Header handleDrawerToggle={handleDrawerToggle} />
                                    <Sidebar
                                        isOpen={isOpen}
                                        handleDrawerToggle={handleDrawerToggle}
                                        onLogout={handleLogout}
                                    />
                                    <div style={{ flex: 1, padding: '20px' }}>
                                        <Dashboard />
                                    </div>
                                    <Footer />
                                </>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    <Route
                        path="/food-requests"
                        element={
                            isAuthenticated ? (
                                <>
                                    <Header handleDrawerToggle={handleDrawerToggle} />
                                    <Sidebar
                                        isOpen={isOpen}
                                        handleDrawerToggle={handleDrawerToggle}
                                        onLogout={handleLogout}
                                    />
                                    <div style={{ flex: 1, padding: '20px' }}>
                                        <FoodRequests />
                                    </div>
                                    <Footer />
                                </>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Redirección para rutas no definidas */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
