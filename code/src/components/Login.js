import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook para redirigir

    const handleLogin = () => {
        // Validación de usuario (esto puede ser más complejo según tu lógica de autenticación)
        if (username === "admin" && password === "password") {
            onLogin(); // Llama a onLogin para actualizar isAuthenticated en App.js
            navigate('/dashboard'); // Redirige al Dashboard después de autenticarse
        } else {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '10%', textAlign: 'center' }}>
            <Typography variant="h4" color="primary" style={{ marginBottom: '20px' }}>
                Sistema de Automatización Hotelera
            </Typography>
            <TextField
                label="Usuario"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ marginBottom: '10px' }}
            />
            <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: '10px' }}
            />
            {error && (
                <Typography color="error" style={{ marginBottom: '10px' }}>
                    {error}
                </Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
            >
                Iniciar Sesión
            </Button>
        </Container>
    );
}

export default Login;
