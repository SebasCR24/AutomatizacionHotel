import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = ({ isOpen, handleDrawerToggle, onSearch, onShowCalendar, onFilter, onLogout }) => {
  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={handleDrawerToggle} // Cierra el Sidebar al hacer clic fuera de él
    >
      <List>
        <ListItem button onClick={onSearch}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="Buscar" />
        </ListItem>
        <ListItem button onClick={onShowCalendar}>
          <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
          <ListItemText primary="Calendario" />
        </ListItem>
        <ListItem button onClick={onFilter}>
          <ListItemIcon><FilterListIcon /></ListItemIcon>
          <ListItemText primary="Filtrar" />
        </ListItem>
        <Divider />
        <ListItem button onClick={onLogout}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
