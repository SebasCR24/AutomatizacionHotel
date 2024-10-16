import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = ({ isOpen, handleDrawerToggle }) => {
  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={handleDrawerToggle}  // Cierra el Sidebar al hacer clic fuera de él
    >
      <List>
        <ListItem button>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="Buscar" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
          <ListItemText primary="Calendario" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><FilterListIcon /></ListItemIcon>
          <ListItemText primary="Filtrar" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
