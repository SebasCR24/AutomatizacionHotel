import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, List, ListItem, Button, Chip } from '@mui/material';
import moment from 'moment';

const initialRequests = [
  {
    id: 1,
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
    id: 2,
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

const Dashboard = () => {
  const [requests, setRequests] = useState(initialRequests);

  const addRequest = () => {
    const newRequest = {
      id: requests.length + 1,
      roomNumber: 303,
      serviceType: 'Limpieza',
      status: 'Pendiente',
      time: moment().format(),
      priority: 'Baja',
      voiceCommand: 'Alexa, solicita limpieza',
      review: 'Nueva solicitud de limpieza.',
      guest: 'Nuevo Huésped'
    };
    setRequests([...requests, newRequest]);
  };

  const updateRequest = (id) => {
    const updatedRequests = requests.map((request) =>
      request.id === id
        ? { ...request, status: 'Completado', review: 'Actualizado' }
        : request
    );
    setRequests(updatedRequests);
  };

  const deleteRequest = (id) => {
    const filteredRequests = requests.filter((request) => request.id !== id);
    setRequests(filteredRequests);
  };

  return (
    <div style={{ 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh', 
      padding: '40px 0', 
      display: 'flex', 
      justifyContent: 'center' 
    }}> 
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 600, fontSize: '28px' }}>
          Solicitudes de los Huéspedes
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={5} style={{ padding: '30px', borderRadius: '15px' }}>
              <Typography variant="h6" gutterBottom style={{ fontWeight: 500 }}>
                Solicitudes recientes
              </Typography>
              <Button variant="contained" color="primary" onClick={addRequest} style={{ marginBottom: '20px', borderRadius: '25px' }}>
                Agregar Solicitud
              </Button>
              <List>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <ListItem key={request.id} style={{ marginBottom: '10px' }}>
                      <Card style={{ width: '100%', padding: '20px', borderRadius: '15px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            Habitación: {request.roomNumber}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" style={{ marginBottom: '10px' }}>
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
                          <Button variant="contained" color="secondary" onClick={() => updateRequest(request.id)} style={{ marginTop: '15px', borderRadius: '25px' }}>
                            Actualizar
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => deleteRequest(request.id)} style={{ marginLeft: '10px', marginTop: '15px', borderRadius: '25px' }}>
                            Eliminar
                          </Button>
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
            <Paper elevation={5} style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#fff' }}>
              <Typography variant="h6" gutterBottom style={{ fontWeight: 500 }}>
                Dispositivos IoT
              </Typography>
              <Typography>Fire TV Stick: Encendido</Typography>
              <Typography>Luces: Apagadas</Typography>
              <Typography>Persianas: Abiertas</Typography>
              <Typography>Aire acondicionado: Apagado</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
