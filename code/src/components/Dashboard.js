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
  const [dailyMenu, setDailyMenu] = useState({
    soup1: '',
    soup2: '',
    mainDish1: '',
    mainDish2: '',
    price: '',
  });

  const [menuMessage, setMenuMessage] = useState('');
  const [isEditingMenu, setIsEditingMenu] = useState(false); // Nuevo estado para el formulario de edición

  const API_BASE_URL = 'https://6ddhofrag9.execute-api.us-east-1.amazonaws.com/PROD/room-service-requests';
  const userRole = JSON.parse(localStorage.getItem('user'))?.role; // Obtener rol del usuario

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

const fetchMenu = async () => {
  try {
    const role = JSON.parse(localStorage.getItem('user'))?.role || '';
    const response = await fetch('http://localhost:5000/api/daily-menu', {
      headers: { 'x-role': role },
    });
    if (response.ok) {
      const menu = await response.json();
      setDailyMenu({
        soup1: menu.soup1 || '',
        soup2: menu.soup2 || '',
        mainDish1: menu.mainDish1 || '',
        mainDish2: menu.mainDish2 || '',
        price: menu.price || '',
        pinDelivery: menu.pinDelivery || '',
      });
    } else {
      console.error('Error al obtener el menú del día:', response.statusText);
    }
  } catch (error) {
    console.error('Error al cargar el menú del día:', error);
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

  const handleMenuChange = (e) => {
    const { name, value } = e.target;
    setDailyMenu({ ...dailyMenu, [name]: value });
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
  
    const sanitizedMenu = {
      soup1: dailyMenu.soup1?.trim() || null,
      soup2: dailyMenu.soup2?.trim() || null,
      mainDish1: dailyMenu.mainDish1?.trim() || null,
      mainDish2: dailyMenu.mainDish2?.trim() || null,
      price: dailyMenu.price ? parseFloat(dailyMenu.price) : null,
      pinDelivery: dailyMenu.pinDelivery?.trim() || null, // Asegúrate de incluir el pinDelivery
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/daily-menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-role': userRole,
        },
        body: JSON.stringify(sanitizedMenu),
      });
  
      if (response.ok) {
        const data = await response.json();
        setMenuMessage(data.message);
        setIsEditingMenu(false);
        fetchMenu(); // Actualiza el menú
        fetchRequests(); // Actualiza las solicitudes para reflejar el nuevo pinDelivery
      } else {
        const errorData = await response.json();
        setMenuMessage(errorData.message || 'Error al registrar el menú.');
      }
    } catch (err) {
      console.error('Error al enviar el menú del día:', err);
      setMenuMessage('Error al registrar el menú del día.');
    }
  };  


  useEffect(() => {
    fetchRequests();
    fetchMenu();
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
                          <Typography><strong>Estado:</strong>
                            <Chip
                              label={request.state}
                              style={{
                                backgroundColor:
                                  request.state === 'Pendiente' ? '#ff9800'
                                  : request.state === 'Realizado' ? '#4caf50'
                                  : '#f44336',
                                color: '#fff',
                              }}
                            />
                          </Typography>
                          <Typography><strong>Solicitud:</strong> {request.specificRequest}</Typography>
                          <Typography><strong>Tipo:</strong> {request.requestType}</Typography>
                          <Typography><strong>Hora Solicitada:</strong> {request.time}</Typography>
                          <Typography><strong>Prioridad:</strong>
                            <Chip
                              label={request.priority}
                              style={{
                                backgroundColor:
                                  request.priority === 'Alta' ? '#f44336'
                                  : request.priority === 'Media' ? '#ff9800'
                                  : '#4caf50',
                                color: '#fff',
                              }}
                            />
                          </Typography>
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
                          )}
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
              {isEditingMenu ? (
                <form onSubmit={handleMenuSubmit}>
                  <TextField label="Sopa 1" name="soup1" value={dailyMenu.soup1} onChange={handleMenuChange} fullWidth style={{ marginBottom: '20px' }}/>
                  <TextField label="Sopa 2" name="soup2" value={dailyMenu.soup2} onChange={handleMenuChange} fullWidth style={{ marginBottom: '20px' }}/>
                  <TextField label="Plato Principal 1" name="mainDish1" value={dailyMenu.mainDish1} onChange={handleMenuChange} fullWidth style={{ marginBottom: '20px' }}/>
                  <TextField label="Plato Principal 2" name="mainDish2" value={dailyMenu.mainDish2} onChange={handleMenuChange} fullWidth style={{ marginBottom: '20px' }}/>
                  <TextField label="Precio (USD)" name="price" type="number" value={dailyMenu.price} onChange={handleMenuChange} fullWidth style={{ marginBottom: '20px' }}/>
                  <TextField label="PIN de Entrega" name="pinDelivery" value={dailyMenu.pinDelivery} onChange={handleMenuChange} fullWidth style={{ marginBottom: '20px' }}/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Button variant="outlined" color="secondary" onClick={() => setIsEditingMenu(false)}>
                      Cancelar
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                      Guardar Menú
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
  <Typography><strong>Sopa 1:</strong> {dailyMenu.soup1}</Typography>
  <Typography><strong>Sopa 2:</strong> {dailyMenu.soup2}</Typography>
  <Typography><strong>Plato Principal 1:</strong> {dailyMenu.mainDish1}</Typography>
  <Typography><strong>Plato Principal 2:</strong> {dailyMenu.mainDish2}</Typography>
  <Typography><strong>Precio:</strong> ${dailyMenu.price}</Typography>
  <Typography><strong>PIN de Entrega:</strong> {dailyMenu.pinDelivery}</Typography> {/* Agregado */}
  {userRole === 'admin' && (
    <Button
      variant="contained"
      color="primary"
      onClick={() => setIsEditingMenu(true)}
      style={{ marginTop: '20px' }}
    >
      Editar Menú
    </Button>
  )}
</div>
              )}
            </Paper>
          </Grid>

        </Grid>
      </Container>

      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
  <DialogTitle style={{ textAlign: 'center', fontWeight: 600, color: '#2196f3' }}>
    Actualizar Solicitud
  </DialogTitle>
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
                selectedRequest?.state === 'Pendiente'
                  ? '#fff3cd'
                  : selectedRequest?.state === 'Realizado'
                  ? '#d4edda'
                  : selectedRequest?.state === 'Cancelado'
                  ? '#f8d7da'
                  : '#fff',
            },
          }}
        >
          <option value="" disabled>
            Selecciona un estado
          </option>
          <option value="Pendiente">Pendiente</option>
          <option value="Realizado">Realizado</option>
          <option value="Cancelado">Cancelado</option>
        </TextField>
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
                selectedRequest?.priority === 'Alta'
                  ? '#f8d7da'
                  : selectedRequest?.priority === 'Media'
                  ? '#fff3cd'
                  : selectedRequest?.priority === 'Baja'
                  ? '#d4edda'
                  : '#fff',
            },
          }}
        >
          <option value="" disabled>
            Selecciona una prioridad
          </option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </TextField>
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
    </div>
  );
};

export default Dashboard;