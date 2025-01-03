import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, List, ListItem, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import moment from 'moment';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const API_BASE_URL = 'https://6ddhofrag9.execute-api.us-east-1.amazonaws.com/PROD/room-service-requests';

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Error al obtener las solicitudes');
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedRequest._id,
          updates: {
            specificRequest: selectedRequest.specificRequest,
            time: selectedRequest.time,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la solicitud. Verifica los permisos o la configuración.');
      }

      setOpenUpdateDialog(false);
      fetchRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedRequest._id }),
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la solicitud. Verifica los permisos o la configuración.');
      }

      setOpenDeleteDialog(false);
      fetchRequests();
    } catch (err) {
      setError(err.message);
    }
  };

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
                      <Card style={{ width: '100%', padding: '20px', borderRadius: '15px' }}>
                        <CardContent>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            Habitación: {request.roomNumber}
                          </Typography>
                          <Typography><strong>Fecha de Solicitud:</strong> {moment(request.requestTime).format('LLL')}</Typography>
                          <Typography><strong>Estado:</strong> {request.state}</Typography>
                          <Typography><strong>Solicitud:</strong> {request.specificRequest}</Typography>
                          <Typography><strong>Tipo:</strong> {request.requestType}</Typography>
                          <Typography><strong>Hora Solicitada:</strong> {request.time}</Typography>
                          <Typography><strong>Prioridad:</strong> 
                            <Chip
                              label={request.priority}
                              style={{
                                backgroundColor:
                                  request.priority === 'alta'
                                    ? '#f44336'
                                    : request.priority === 'media'
                                    ? '#ff9800'
                                    : '#4caf50',
                                color: '#fff',
                              }}
                            />
                          </Typography>
                          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '15px' }}>
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: '#9436cd',
                                color: '#fff',
                                marginRight: '10px',
                                borderRadius: '25px',
                              }}
                              onClick={() => {
                                setSelectedRequest(request);
                                setOpenUpdateDialog(true);
                              }}
                            >
                              Actualizar
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              style={{
                                borderRadius: '25px',
                              }}
                              onClick={() => {
                                setSelectedRequest(request);
                                setOpenDeleteDialog(true);
                              }}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              )}
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

      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
        <DialogTitle>Actualizar Solicitud</DialogTitle>
        <DialogContent>
          <TextField
            label="Solicitud"
            value={selectedRequest?.specificRequest || ''}
            onChange={(e) => setSelectedRequest({ ...selectedRequest, specificRequest: e.target.value })}
            fullWidth
          />
          <TextField
            label="Hora"
            value={selectedRequest?.time || ''}
            onChange={(e) => setSelectedRequest({ ...selectedRequest, time: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdate} color="primary">Actualizar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar esta solicitud?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
