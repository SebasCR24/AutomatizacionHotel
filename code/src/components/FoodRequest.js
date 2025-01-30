import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, List, ListItem, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import moment from 'moment';
import Sidebar from './Sidebar';

const FoodRequests = () => {
  const [foodRequests, setFoodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const API_FOOD_REQUESTS_URL = 'https://nj736xewbg.execute-api.us-east-1.amazonaws.com/PROD/food-service-requests';
  const userRole = JSON.parse(localStorage.getItem('user'))?.role; // Obtener el rol del usuario

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

  const handleUpdate = async () => {
    try {
      const { _id, ...updates } = selectedRequest;
      const response = await fetch(`${API_FOOD_REQUESTS_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: _id,
          updates,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la solicitud. Verifica los permisos o la configuración.');
      }

      setOpenUpdateDialog(false);
      fetchFoodRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_FOOD_REQUESTS_URL}`, {
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
      fetchFoodRequests();
    } catch (err) {
      setError(err.message);
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

        <Grid container spacing={4}>
          <Grid item xs={12}>
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
                  {foodRequests.map((request) => (
                    <ListItem key={request._id} style={{ marginBottom: '10px' }}>
                      <Card style={{ width: '100%', padding: '20px', borderRadius: '15px' }}>
                        <CardContent>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            Categoría: {request.foodCategory}
                          </Typography>
                          <Typography><strong>Detalles:</strong> {request.details}</Typography>
                          <Typography><strong>Cantidad:</strong> {request.numOfBreakfast}</Typography>
                          <Typography><strong>Precio Total:</strong> ${request.totalPrice}</Typography>
                          <Typography><strong>Fecha de Solicitud:</strong> {moment(request.requestTime).format('LLL')}</Typography>
                          <Typography><strong>Estado:</strong>
                            <Chip
                              label={request.state}
                              style={{
                                backgroundColor:
                                  request.state === 'pendiente' ? '#ff9800'
                                  : request.state === 'realizado' ? '#4caf50'
                                  : '#f44336',
                                color: '#fff',
                              }}
                            />
                          </Typography>
                          <Typography><strong>Tipo:</strong> {request.requestType}</Typography>
                          <Typography><strong>Prioridad:</strong>
                            <Chip
                              label={request.priority}
                              style={{
                                backgroundColor:
                                  request.priority === 'alta' ? '#f44336'
                                  : request.priority === 'media' ? '#ff9800'
                                  : '#4caf50',
                                color: '#fff',
                              }}
                            />
                          </Typography>
                          <Typography><strong>Para:</strong> {request.herOrToGo}</Typography>
                          <Typography><strong>Pin de Entrega:</strong> {request.pinDelivery}</Typography>
                          {userRole === 'admin' && ( // Mostrar botones solo si el rol es admin
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
                                style={{ borderRadius: '25px' }}
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setOpenDeleteDialog(true);
                                }}
                              >
                                Eliminar
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
          <DialogTitle style={{ textAlign: 'center', fontWeight: 600, color: '#2196f3' }}>
            Actualizar Solicitud
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ marginTop: '10px' }}>
                <TextField
                  label="Categoría"
                  value={selectedRequest?.foodCategory || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, foodCategory: e.target.value })}
                  fullWidth
                  style={{ marginBottom: '15px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Detalles"
                  value={selectedRequest?.details || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, details: e.target.value })}
                  fullWidth
                  style={{ marginBottom: '15px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Cantidad"
                  type="number"
                  value={selectedRequest?.numOfBreakfast || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, numOfBreakfast: e.target.value })}
                  fullWidth
                  style={{ marginBottom: '15px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Precio Total"
                  type="number"
                  value={selectedRequest?.totalPrice || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, totalPrice: e.target.value })}
                  fullWidth
                  style={{ marginBottom: '15px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Estado"
                  value={selectedRequest?.state || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, state: e.target.value })}
                  fullWidth
                  style={{ marginBottom: '15px' }}
                  SelectProps={{
                    native: true,
                  }}
                  InputProps={{
                    style: {
                      backgroundColor:
                        selectedRequest?.state === 'pendiente'
                          ? '#fff3cd'
                          : selectedRequest?.state === 'realizado'
                          ? '#d4edda'
                          : selectedRequest?.state === 'cancelado'
                          ? '#f8d7da'
                          : '#fff',
                    },
                  }}
                >
                  <option value="" disabled>
                    Selecciona un estado
                  </option>
                  <option value="pendiente">Pendiente</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Prioridad"
                  value={selectedRequest?.priority || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, priority: e.target.value })}
                  fullWidth
                  style={{ marginBottom: '15px' }}
                  SelectProps={{
                    native: true,
                  }}
                  InputProps={{
                    style: {
                      backgroundColor:
                        selectedRequest?.priority === 'alta'
                          ? '#f8d7da'
                          : selectedRequest?.priority === 'media'
                          ? '#fff3cd'
                          : selectedRequest?.priority === 'baja'
                          ? '#d4edda'
                          : '#fff',
                    },
                  }}
                >
                  <option value="" disabled>
                    Selecciona una prioridad
                  </option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Para"
                  value={selectedRequest?.herOrToGo || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, herOrToGo: e.target.value })}
                  fullWidth
                  style={{ marginBottom: '15px' }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center', marginBottom: '10px' }}>
            <Button onClick={() => setOpenUpdateDialog(false)} style={{ color: '#ff1744' }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} style={{ backgroundColor: '#2196f3', color: '#fff' }}>
              Actualizar
            </Button>
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
      </Container>
    </div>
  );
};

export default FoodRequests;
