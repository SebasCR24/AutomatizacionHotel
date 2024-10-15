import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, List, ListItem, ListItemText, Chip } from '@mui/material';
import axios from 'axios';
import moment from 'moment';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);

  // Simulamos una llamada a la API para obtener las solicitudes con los nuevos campos
  useEffect(() => {
    const mockData = [
      {
        roomNumber: 101,
        serviceType: 'Servicio a la habitación',
        status: 'En proceso',
        time: '2024-10-14T10:45:00',
        priority: 'Alta',
        voiceCommand: 'Alexa, trae toallas adicionales',
        review: 'Excelente servicio, rápido y eficiente.',
        guest: 'John Doe'
      },
      {
        roomNumber: 202,
        serviceType: 'Limpieza',
        status: 'Completado',
        time: '2024-10-14T09:30:00',
        priority: 'Media',
        voiceCommand: 'Alexa, solicita limpieza',
        review: 'Servicio aceptable, pero podría ser más rápido.',
        guest: 'Jane Doe'
      }
    ];

    // Simulamos la asignación de los datos simulados a la variable de estado
    setRequests(mockData);

    // Código comentado para el caso de una API real:
    /*
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/requests'); // Reemplaza con tu API real
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
    */
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Solicitudes de los Huéspedes
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Solicitudes recientes
            </Typography>
            <List>
              {requests.length > 0 ? (
                requests.map((request, index) => (
                  <ListItem key={index} style={{ marginBottom: '10px' }}>
                    <Card style={{ width: '100%', padding: '15px' }} variant="outlined">
                      <CardContent>
                        <Typography variant="h6">
                          Habitación: {request.roomNumber}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Tipo de Solicitud:</strong> {request.serviceType}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Estado:</strong> {request.status}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Hora de Solicitud:</strong> {moment(request.time).format('LLL')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Prioridad:</strong> <Chip label={request.priority} color={request.priority === 'Alta' ? 'error' : 'primary'} />
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Comando de Voz:</strong> {request.voiceCommand}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Reseña del Huésped:</strong> {request.review}
                        </Typography>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))
              ) : (
                <Typography>No hay solicitudes por el momento.</Typography>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Dispositivos IoT
            </Typography>
            <Typography>Cortinas: Abiertas</Typography>
            <Typography>Luces: Encendidas</Typography>
            {/* Aquí puedes mostrar el estado de otros dispositivos */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
