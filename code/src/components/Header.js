import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header = ({ handleDrawerToggle }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h4" style={{ flexGrow: 1, textAlign: 'center', fontSize: '30px' }}> {/* Tamaño más grande para el título */}
          Sistema de Automatización Hotelera
        </Typography>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
