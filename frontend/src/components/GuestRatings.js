import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  Card,
  CardContent,
  TextField,
  Rating,
} from '@mui/material';
import moment from 'moment';
import Sidebar from './Sidebar';

const GuestRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRating, setNewRating] = useState({
    roomNumber: '',
    ratingValue: 0,
    customerComment: '',
  });
  const [isPosting, setIsPosting] = useState(false);

  const API_REVIEWS_URL = 'https://6ddhofrag9.execute-api.us-east-1.amazonaws.com/PROD/review-service-requests';
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
      setRatings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Método para agregar una nueva calificación
  const handlePostRating = async (e) => {
    e.preventDefault();
    try {
      // Validación de campos
      if (!newRating.roomNumber || newRating.ratingValue === 0 || !newRating.customerComment) {
        setError('Todos los campos son obligatorios.');
        return;
      }

      // Enviar la solicitud
      const response = await fetch(API_REVIEWS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-role': userRole || 'guest',
        },
        body: JSON.stringify(newRating),
      });

      // Verificar la respuesta
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error en el POST:', errorDetails);
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Calificación añadida:', data);

      // Refrescar las calificaciones y limpiar el formulario
      fetchRatings();
      setNewRating({ roomNumber: '', ratingValue: 0, customerComment: '' });
      setError(null);
    } catch (error) {
      console.error('Error al agregar la calificación:', error.message);
      setError('Error al agregar la calificación: ' + error.message);
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
                            {/* Aquí dividimos la calificación entre 2 antes de mostrarla */}
                            <Rating value={rating.ratingValue / 2} readOnly precision={0.5} />
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {userRole === 'admin' && (
            <Grid item xs={12}>
              <Paper elevation={5} style={{ padding: '30px', borderRadius: '15px', backgroundColor: '#fff' }}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 500 }}>
                  Agregar Calificación
                </Typography>
                <form onSubmit={handlePostRating}>
                  <TextField
                    label="Número de Habitación"
                    name="roomNumber"
                    value={newRating.roomNumber}
                    onChange={(e) => setNewRating({ ...newRating, roomNumber: e.target.value })}
                    fullWidth
                    style={{ marginBottom: '20px' }}
                  />
                  <TextField
                    label="Comentario"
                    name="customerComment"
                    value={newRating.customerComment}
                    onChange={(e) => setNewRating({ ...newRating, customerComment: e.target.value })}
                    fullWidth
                    style={{ marginBottom: '20px' }}
                  />
                  <Typography style={{ marginBottom: '10px' }}>Calificación:</Typography>
                  <Rating
                    name="ratingValue"
                    value={newRating.ratingValue / 2} 
                    onChange={(e, newValue) => setNewRating({ ...newRating, ratingValue: newValue * 2 })}
                    precision={0.5}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setIsPosting(false)}
                      style={{ marginRight: '10px' }}
                    >
                      Cancelar
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                      Guardar Calificación
                    </Button>
                  </div>
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
