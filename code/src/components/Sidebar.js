import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
/*
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
*/

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, handleDrawerToggle, onSearch, onShowCalendar, onFilter, onLogout }) => {
    const navigate = useNavigate();

    return (
        <Drawer
            anchor="left"
            open={isOpen}
            onClose={handleDrawerToggle}
        >
            <List>
                <ListItem 
                    button 
                    onClick={() => navigate('/dashboard')} 
                    style={{ cursor: 'pointer' }} // Cambia el cursor a una flecha
                >
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Inicio" />
                </ListItem>
                {/* Opciones desactivadas temporalmente para futuros usos */}
                {/* <ListItem 
                    button 
                    onClick={onSearch} 
                    style={{ cursor: 'pointer' }} // Cambia el cursor a una flecha
                >
                    <ListItemIcon><SearchIcon /></ListItemIcon>
                    <ListItemText primary="Buscar" />
                </ListItem>
                <ListItem 
                    button 
                    onClick={onShowCalendar} 
                    style={{ cursor: 'pointer' }} // Cambia el cursor a una flecha
                >
                    <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                    <ListItemText primary="Calendario" />
                </ListItem>
                <ListItem 
                    button 
                    onClick={onFilter} 
                    style={{ cursor: 'pointer' }} // Cambia el cursor a una flecha
                >
                    <ListItemIcon><FilterListIcon /></ListItemIcon>
                    <ListItemText primary="Filtrar" />
                </ListItem> */}
                <ListItem 
                    button 
                    onClick={() => navigate('/food-requests')} 
                    style={{ cursor: 'pointer' }} // Cambia el cursor a una flecha
                >
                    <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
                    <ListItemText primary="Solicitudes de comida" />
                </ListItem>
                <Divider />
                <ListItem 
                    button 
                    onClick={onLogout} 
                    style={{ cursor: 'pointer' }} // Cambia el cursor a una flecha
                >
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
