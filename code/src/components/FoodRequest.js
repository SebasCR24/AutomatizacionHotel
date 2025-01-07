import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, List, ListItem, Card, CardContent } from '@mui/material';
import Sidebar from './Sidebar';

const FoodRequests = () => {
    const [foodRequests, setFoodRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_FOOD_REQUESTS_URL = 'https://6ddhofrag9.execute-api.us-east-1.amazonaws.com/PROD/food-requests';

    const fetchFoodRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_FOOD_REQUESTS_URL);
            if (!response.ok) {
                throw new Error('Error al obtener las solicitudes de comida');
            }
            const data = await response.json();
            setFoodRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoodRequests();
    }, []);

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
            <Sidebar />
            <Container maxWidth="lg">
                <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 600, fontSize: '28px' }}>
                    Solicitudes de Comida
                </Typography>

                <Paper elevation={5} style={{ padding: '30px', borderRadius: '15px' }}>
                    {loading ? (
                        <Typography>Cargando...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <List>
                            {foodRequests.map((request) => (
                                <ListItem key={request.id} style={{ marginBottom: '10px' }}>
                                    <Card style={{ width: '100%', padding: '20px', borderRadius: '15px' }}>
                                        <CardContent>
                                            <Typography variant="h6" style={{ fontWeight: 600 }}>
                                                Habitación: {request.roomNumber}
                                            </Typography>
                                            <Typography><strong>Comida:</strong> {request.food}</Typography>
                                            <Typography><strong>Hora de Solicitud:</strong> {request.time}</Typography>
                                            <Typography><strong>Estado:</strong> {request.status}</Typography>
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </Container>
        </div>
    );
};

export default FoodRequests;
