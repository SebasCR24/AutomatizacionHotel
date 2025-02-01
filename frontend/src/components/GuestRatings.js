import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, List, ListItem, Card, CardContent, Rating, Button, TextField } from '@mui/material';
import moment from 'moment';
import Sidebar from './Sidebar';

const GuestRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRating, setNewRating] = useState({ roomNumber: '', ratingValue: '', customerComment: '' });
    const [message, setMessage] = useState('');
    
    const API_REVIEWS_URL = `${process.env.REACT_APP_API_URL}/review-service-requests`;
    const userRole = JSON.parse(localStorage.getItem('user'))?.role || 'guest';

    const fetchRatings = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_REVIEWS_URL, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-role": userRole, 
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) throw new Error(`Error ${response.status}: No tienes acceso a las calificaciones`);

            const data = await response.json();
            const transformedData = data.map((rating) => ({
                ...rating,
                stars: (rating.ratingValue / 10) * 5, 
            }));

            setRatings(transformedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newRating.roomNumber || !newRating.ratingValue || !newRating.customerComment) {
            setMessage("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await fetch(API_REVIEWS_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-role": userRole,
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    roomNumber: newRating.roomNumber,
                    ratingValue: parseFloat(newRating.ratingValue),
                    customerComment: newRating.customerComment,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error("Error al agregar la calificación");

            setNewRating({ roomNumber: '', ratingValue: '', customerComment: '' });
            setMessage("Calificación agregada correctamente");

            // Desvanecer el mensaje después de 3 segundos
            setTimeout(() => setMessage(''), 3000);

            fetchRatings(); // Refrescar la lista
        } catch (err) {
            setMessage("Error al agregar la calificación.");
        }
    };

    useEffect(() => {
        fetchRatings();
    }, []);

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
            <Sidebar />
            <Container maxWidth="lg">
                <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 600, fontSize: '28px' }}>
                    Calificaciones de los Huéspedes
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={5} style={{ padding: '30px', borderRadius: '15px' }}>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 500 }}>
                                Calificaciones Recientes
                            </Typography>
                            {loading ? (
                                <Typography>Cargando...</Typography>
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : (
                                <List>
                                    {ratings.map((rating) => (
                                        <ListItem key={rating._id} style={{ marginBottom: '10px' }}>
                                            <Card style={{ width: '100%', padding: '20px', borderRadius: '15px' }}>
                                                <CardContent>
                                                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                                                        Habitación: {rating.roomNumber}
                                                    </Typography>
                                                    <Typography><strong>Fecha:</strong> {moment(rating.timestamp).format('LLL')}</Typography>
                                                    <Typography><strong>Comentario:</strong> {rating.customerComment}</Typography>
                                                    <Typography>
                                                        <strong>Calificación:</strong>
                                                        <Rating value={rating.stars} readOnly precision={0.5} />
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    </Grid>

                    {userRole === "admin" && (
                        <Grid item xs={12} md={4}>
                            <Paper elevation={5} style={{ padding: '30px', borderRadius: '15px', backgroundColor: '#fff' }}>
                                <Typography variant="h6" gutterBottom style={{ fontWeight: 500, textAlign: 'center' }}>
                                    Agregar Nueva Calificación
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        label="Número de Habitación"
                                        name="roomNumber"
                                        type="number"
                                        value={newRating.roomNumber}
                                        onChange={(e) => setNewRating({ ...newRating, roomNumber: e.target.value })}
                                        fullWidth
                                        required
                                        style={{ marginBottom: '15px' }}
                                    />
                                    <TextField
                                        label="Calificación (1-10)"
                                        name="ratingValue"
                                        type="number"
                                        inputProps={{ min: 1, max: 10 }}
                                        value={newRating.ratingValue}
                                        onChange={(e) => setNewRating({ ...newRating, ratingValue: e.target.value })}
                                        fullWidth
                                        required
                                        style={{ marginBottom: '15px' }}
                                    />
                                    <TextField
                                        label="Comentario"
                                        name="customerComment"
                                        multiline
                                        rows={3}
                                        value={newRating.customerComment}
                                        onChange={(e) => setNewRating({ ...newRating, customerComment: e.target.value })}
                                        fullWidth
                                        required
                                        style={{ marginBottom: '15px' }}
                                    />

                                    {message && (
                                        <Typography color="primary" style={{ marginBottom: '10px', transition: 'opacity 0.5s' }}>
                                            {message}
                                        </Typography>
                                    )}

                                    <Button variant="contained" color="primary" fullWidth type="submit">
                                        Enviar Calificación
                                    </Button>
                                </form>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    );
};

export default GuestRatings;
