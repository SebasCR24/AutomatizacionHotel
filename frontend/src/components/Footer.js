import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#f4f4f4' }}>
      <Typography variant="body2" color="textSecondary">
        © 2024 Sistema de Automatización Hotelera. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
