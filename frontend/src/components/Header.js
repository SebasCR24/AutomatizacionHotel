import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header = ({ handleDrawerToggle }) => {
  return (
    <AppBar
      position="static"
      style={{
        background: 'linear-gradient(90deg, #2196f3 0%, rgba(3,169,244,1) 100%)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '0px 0',
      }}
    >
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle} // Asegura que el evento está conectado al handler
          >
            <MenuIcon />
          </IconButton>

          {/* Aquí mostramos el logo accediendo a él desde la carpeta public */}
          <img
            src="/assets/logosinfondo.png" // Acceso directo a la imagen del logo
            alt="logo"
            style={{ height: '120px', marginLeft: '5px', marginRight: '5px' }}
          />

          <Typography
            variant="h4"
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#fff',
              position: 'absolute', // Para centrar el título
              left: '50%',
              transform: 'translateX(-50%)', // Centra horizontalmente
            }}
          >
            Sistema de Automatización Hotelera
          </Typography>
        </Box>

        <IconButton color="inherit">
          <AccountCircle style={{ fontSize: '30px' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
