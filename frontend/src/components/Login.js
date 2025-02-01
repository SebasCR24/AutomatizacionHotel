import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api-login`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('role', data.role);
                onLogin();
                navigate('/dashboard');
            } else {
                setError('Usuario o contraseña incorrectos');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
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
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                Iniciar Sesión
            </Button>
        </Container>
    );
}

export default Login;
