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
  const [menu, setMenu] = useState({
    breakfastAmerican: '',
    breakfastContinental: '',
    lunchSoup: '',
    lunchRice: ''
  });

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
      const { _id, ...updates } = selectedRequest;
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: _id,
          updates: updates,
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

  const handleMenuSubmit = () => {
    console.log('Menú actualizado:', menu);
    // Aquí puedes agregar la lógica para enviar el menú a tu backend o API
    alert('Menú actualizado correctamente.');
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
              <Typography variant="h6" gutterBottom style={{ fontWeight: 500, textAlign: 'center' }}>
                Menú del Día
              </Typography>
              <TextField
                label="Desayuno Americano"
                value={menu.breakfastAmerican}
                onChange={(e) => setMenu({ ...menu, breakfastAmerican: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
              <TextField
                label="Desayuno Continental"
                value={menu.breakfastContinental}
                onChange={(e) => setMenu({ ...menu, breakfastContinental: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
              <TextField
                label="Sopa (Almuerzo Opción 1)"
                value={menu.lunchSoup}
                onChange={(e) => setMenu({ ...menu, lunchSoup: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
              <TextField
                label="Sopa (Almuerzo Opción 2)"
                value={menu.lunchSoup}
                onChange={(e) => setMenu({ ...menu, lunchSoup: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
              <TextField
                label="Arroz (Almuerzo Opción 1)"
                value={menu.lunchRice}
                onChange={(e) => setMenu({ ...menu, lunchRice: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
              <TextField
                label="Arroz (Almuerzo Opción 2)"
                value={menu.lunchRice}
                onChange={(e) => setMenu({ ...menu, lunchRice: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
              <Button
                variant="contained"
                fullWidth
                style={{ backgroundColor: '#2196f3', color: '#fff' }}
                onClick={handleMenuSubmit}
              >
                Guardar Menú
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
        <DialogTitle style={{ textAlign: 'center', fontWeight: 600, color: '#2196f3' }}>Actualizar Solicitud</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Habitación"
                value={selectedRequest?.roomNumber || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, roomNumber: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px', marginTop: '10px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Estado"
                value={selectedRequest?.state || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, state: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Solicitud"
                value={selectedRequest?.specificRequest || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, specificRequest: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tipo"
                value={selectedRequest?.requestType || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, requestType: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Hora Solicitada"
                type="time"
                value={selectedRequest?.time || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, time: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Prioridad"
                value={selectedRequest?.priority || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, priority: e.target.value })}
                fullWidth
                style={{ marginBottom: '15px' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', marginBottom: '10px' }}>
          <Button onClick={() => setOpenUpdateDialog(false)} style={{ color: '#ff1744' }}>Cancelar</Button>
          <Button onClick={handleUpdate} style={{ backgroundColor: '#2196f3', color: '#fff' }}>Actualizar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle style={{ textAlign: 'center', color: '#ff1744' }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography style={{ textAlign: 'center' }}>¿Estás seguro de que deseas eliminar esta solicitud?</Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button onClick={() => setOpenDeleteDialog(false)} style={{ color: '#ff1744' }}>Cancelar</Button>
          <Button onClick={handleDelete} style={{ backgroundColor: '#ff1744', color: '#fff' }}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
