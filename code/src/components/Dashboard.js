import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);

  // Simulamos una llamada a la API para obtener las solicitudes
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/requests'); // Reemplaza con tu API
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <Container maxWidth="lg">
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
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Solicitud: ${request.service}`}
                      secondary={`Estado: ${request.status} - Realizada por: ${request.guest}`}
                    />
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
