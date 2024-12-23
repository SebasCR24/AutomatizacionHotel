import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, List, ListItem, Card, CardContent, Chip } from '@mui/material';
import moment from 'moment';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [requests, setRequests] = useState([]); // Estado para almacenar las solicitudes
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Indicador de error

  // Endpoint base
  const API_BASE_URL = 'https://6ddhofrag9.execute-api.us-east-1.amazonaws.com/PROD/room-service-requests';

  // Función para obtener solicitudes desde el backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Error al obtener las solicitudes');
      }
      const data = await response.json();
      setRequests(data); // Asume que `data` es un array de solicitudes
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar una solicitud (PUT)
  const updateRequest = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la solicitud');
      }

      fetchRequests(); // Refrescar la lista después de la actualización
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Función para eliminar una solicitud (DELETE)
  const deleteRequest = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la solicitud');
      }

      fetchRequests(); // Refrescar la lista después de la eliminación
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Llamada inicial al montar el componente
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
      <Sidebar />
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 600, fontSize: '28px' }}>
          Solicitudes de los Huéspedes
        </Typography>

        <Grid container spacing={4}>
          {/* Lista de Solicitudes */}
          <Grid item xs={12} md={8}>
            <Paper elevation={5} style={{ padding: '30px', borderRadius: '15px' }}>
              <Typography variant="h6" gutterBottom style={{ fontWeight: 500 }}>
                Solicitudes recientes
              </Typography>
              {loading ? (
                <Typography>Cargando...</Typography>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <List>
                  {requests.map((request) => (
                    <ListItem key={request._id} style={{ marginBottom: '10px' }}>
                      <Card style={{ width: '100%', padding: '20px', borderRadius: '15px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            Habitación: {request.roomNumber || 'Sin número'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Tipo de Solicitud:</strong> {request.requestType || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Estado:</strong> {request.state || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Hora de Solicitud:</strong> {moment(request.requestTime).format('LLL') || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Prioridad:</strong> <Chip label={request.priority || 'N/A'} color={request.priority === 'alta' ? 'error' : 'primary'} />
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Solicitud Específica:</strong> {request.specificRequest || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Hora:</strong> {request.time || 'N/A'}
                          </Typography>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => updateRequest(request._id, { ...request, state: 'actualizado' })}
                            style={{ marginTop: '15px', borderRadius: '25px' }}
                          >
                            Actualizar
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => deleteRequest(request._id)}
                            style={{ marginLeft: '10px', marginTop: '15px', borderRadius: '25px' }}
                          >
                            Eliminar
                          </Button>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Espacio reservado para otras funcionalidades */}
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
