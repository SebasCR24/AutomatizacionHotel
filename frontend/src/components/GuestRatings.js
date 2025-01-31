import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, List, ListItem, Card, CardContent, Rating } from '@mui/material';
import moment from 'moment';
import Sidebar from './Sidebar';

const GuestRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_REVIEWS_URL = process.env.REACT_APP_API_URL;
  const userRole = JSON.parse(localStorage.getItem('user'))?.role || 'guest';

  // Método para obtener las calificaciones
  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_REVIEWS_URL);
      if (!response.ok) {
        throw new Error('Error al obtener las calificaciones');
      }
      const data = await response.json();
      
      // Convertir ratingValue a un valor proporcional para estrellas (sobre 5)
      const transformedData = data.map((rating) => ({
        ...rating,
        stars: (rating.ratingValue / 10) * 5, // Convertir sobre 5 estrellas
      }));

      setRatings(transformedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
      <Sidebar />
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          gutterBottom
          style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 600, fontSize: '28px' }}
        >
          Calificaciones de los Huéspedes
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
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
        </Grid>
      </Container>
    </div>
  );
};

export default GuestRatings;
