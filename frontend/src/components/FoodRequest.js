import React, { useEffect, useState } from 'react';
import {Container, Grid, Paper, Typography, Button, List, ListItem, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from '@mui/material';
import moment from 'moment';
import Sidebar from './Sidebar';

const FoodRequests = () => {
  const [foodRequests, setFoodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const API_FOOD_REQUESTS_URL =
    'https://6ddhofrag9.execute-api.us-east-1.amazonaws.com/PROD/food-service-requests';
  const userRole = JSON.parse(localStorage.getItem('user'))?.role;

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

      // Convertir valores vacíos en null antes de enviar
      const sanitizedUpdates = Object.fromEntries(
        Object.entries(updates).map(([key, value]) => [key, value === '' ? null : value])
      );

      const response = await fetch(`${API_FOOD_REQUESTS_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: _id,
          updates: sanitizedUpdates,
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
    <div
      style={{
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        padding: '40px 0',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Sidebar />
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          gutterBottom
          style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 600, fontSize: '28px' }}
        >
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
                            Categoría: {request.foodCategory || 'No especificada'}
                          </Typography>

                          {request.foodCategory === 'desayuno' && (
                            <>
                              <Typography>
                                <strong>Detalles:</strong> {request.details || 'No especificado'}
                              </Typography>
                              <Typography>
                                <strong>Cantidad:</strong> {request.numOfBreakfast || 'No especificada'}
                              </Typography>
                            </>
                          )}

                          {request.foodCategory === 'almuerzo' && (
                            <>
                              <Typography>
                                <strong>Primer Plato:</strong> {request.soupChoice || 'No especificado'}
                              </Typography>
                              <Typography>
                                <strong>Plato Principal:</strong> {request.mainDishChoice || 'No especificado'}
                              </Typography>
                              <Typography>
                                <strong>Cantidad:</strong> {request.numOfLunch || 'No especificada'}
                              </Typography>
                            </>
                          )}

                          <Typography>
                            <strong>Precio Total:</strong> ${request.totalPrice || 'No especificado'}
                          </Typography>
                          <Typography>
                            <strong>Fecha de Solicitud:</strong>{' '}
                            {moment(request.requestTime).format('LLL') || 'No especificada'}
                          </Typography>
                          <Typography>
                            <strong>Estado:</strong>
                            <Chip
                              label={request.state || 'No especificado'}
                              style={{
                                backgroundColor:
                                  request.state === 'pendiente'
                                    ? '#ff9800'
                                    : request.state === 'realizado'
                                    ? '#4caf50'
                                    : '#f44336',
                                color: '#fff',
                              }}
                            />
                          </Typography>
                          <Typography><strong>Tipo:</strong> {request.requestType}</Typography>
                          <Typography>
                            <strong>Prioridad:</strong>
                            <Chip
                              label={request.priority || 'No especificada'}
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
                          <Typography>
                            <strong>Para:</strong> {request.herOrToGo || 'No especificado'}
                          </Typography>
                          <Typography>
                            <strong>Pin de Entrega:</strong> {request.pinDelivery || 'No especificado'}
                          </Typography>

                          {userRole === 'admin' && (
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
    <Grid container spacing={2} style={{ marginTop: '15px' }}>
      {/* Campos específicos para desayuno */}
      {selectedRequest?.foodCategory === 'desayuno' && (
        <>
          <Grid item xs={12}>
            <TextField
              label="Detalles"
              value={selectedRequest?.details ?? ''}
              onChange={(e) => setSelectedRequest({ ...selectedRequest, details: e.target.value || null })}
              fullWidth
              style={{ marginBottom: '15px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cantidad (Desayuno)"
              type="number"
              value={selectedRequest?.numOfBreakfast ?? ''}
              onChange={(e) =>
                setSelectedRequest({
                  ...selectedRequest,
                  numOfBreakfast: e.target.value === '' ? null : parseInt(e.target.value),
                })
              }
              fullWidth
              style={{ marginBottom: '15px' }}
            />
          </Grid>
        </>
      )}

      {/* Campos específicos para almuerzo */}
      {selectedRequest?.foodCategory === 'almuerzo' && (
        <>
          <Grid item xs={12}>
            <TextField
              label="Primer Plato"
              value={selectedRequest?.soupChoice ?? ''}
              onChange={(e) => setSelectedRequest({ ...selectedRequest, soupChoice: e.target.value || null })}
              fullWidth
              style={{ marginBottom: '15px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Plato Principal"
              value={selectedRequest?.mainDishChoice ?? ''}
              onChange={(e) =>
                setSelectedRequest({ ...selectedRequest, mainDishChoice: e.target.value || null })
              }
              fullWidth
              style={{ marginBottom: '15px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cantidad (Almuerzo)"
              type="number"
              value={selectedRequest?.numOfLunch ?? ''}
              onChange={(e) =>
                setSelectedRequest({
                  ...selectedRequest,
                  numOfLunch: e.target.value === '' ? null : parseInt(e.target.value),
                })
              }
              fullWidth
              style={{ marginBottom: '15px' }}
            />
          </Grid>
        </>
      )}

      {/* Campos comunes para ambas categorías */}
      <Grid item xs={12}>
        <TextField
          label="Precio Total"
          type="number"
          value={selectedRequest?.totalPrice ?? ''}
          onChange={(e) =>
            setSelectedRequest({
              ...selectedRequest,
              totalPrice: e.target.value === '' ? null : parseFloat(e.target.value),
            })
          }
          fullWidth
          style={{ marginBottom: '15px' }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          label="Estado"
          value={selectedRequest?.state ?? ''}
          onChange={(e) => setSelectedRequest({ ...selectedRequest, state: e.target.value || null })}
          fullWidth
          style={{ marginBottom: '15px' }}
          SelectProps={{
            native: true,
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
          value={selectedRequest?.priority ?? ''}
          onChange={(e) => setSelectedRequest({ ...selectedRequest, priority: e.target.value || null })}
          fullWidth
          style={{ marginBottom: '15px' }}
          SelectProps={{
            native: true,
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
          value={selectedRequest?.herOrToGo ?? ''}
          onChange={(e) => setSelectedRequest({ ...selectedRequest, herOrToGo: e.target.value || null })}
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
    <Typography style={{ textAlign: 'center' }}>
      ¿Estás seguro de que deseas eliminar esta solicitud?
    </Typography>
  </DialogContent>
  <DialogActions style={{ justifyContent: 'center' }}>
    <Button onClick={() => setOpenDeleteDialog(false)} style={{ color: '#ff1744' }}>
      Cancelar
    </Button>
    <Button onClick={handleDelete} style={{ backgroundColor: '#ff1744', color: '#fff' }}>
      Eliminar
    </Button>
  </DialogActions>
</Dialog>

      </Container>
    </div>
  );
};

export default FoodRequests;
