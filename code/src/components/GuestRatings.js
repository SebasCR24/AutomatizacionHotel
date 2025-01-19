import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, List, ListItem, Card, CardContent, Chip } from '@mui/material';
import moment from 'moment';
import Sidebar from './Sidebar';

const GuestRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_GUEST_RATINGS_URL = ''; // Cambia esto cuando tengas el endpoint

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_GUEST_RATINGS_URL);
      if (!response.ok) {
        throw new Error('Error al obtener las calificaciones de los huéspedes');
      }
      const data = await response.json();
      setRatings(data);
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
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 600, fontSize: '28px' }}>
          Calificaciones de los Huéspedes
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={5} style={{ padding: '30px', borderRadius: '15px' }}>
              <Typography variant="h6" gutterBottom style={{ fontWeight: 500 }}>
                Reseñas recientes
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
                            Huésped: {rating.guestName || 'Anónimo'}
                          </Typography>
                          <Typography>
                            <strong>Fecha:</strong> {moment(rating.date).format('LL')}
                          </Typography>
                          <Typography>
                            <strong>Calificación:</strong>
                            <Chip
                              label={`${rating.score}/5`}
                              style={{
                                backgroundColor: rating.score >= 4 ? '#4caf50' : rating.score >= 3 ? '#ff9800' : '#f44336',
                                color: '#fff',
                              }}
                            />
                          </Typography>
                          <Typography>
                            <strong>Reseña:</strong> {rating.review}
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
