import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star'; // Ícono para calificaciones
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, handleDrawerToggle, onLogout }) => {
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
                    style={{ cursor: 'pointer' }}
                >
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Inicio" />
                </ListItem>
                <ListItem 
                    button 
                    onClick={() => navigate('/food-requests')} 
                    style={{ cursor: 'pointer' }}
                >
                    <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
                    <ListItemText primary="Solicitudes de comida" />
                </ListItem>
                <ListItem 
                    button 
                    onClick={() => navigate('/guest-ratings')} 
                    style={{ cursor: 'pointer' }}
                >
                    <ListItemIcon><StarIcon /></ListItemIcon>
                    <ListItemText primary="Calificaciones de los huéspedes" />
                </ListItem>
                <Divider />
                <ListItem 
                    button 
                    onClick={onLogout} 
                    style={{ cursor: 'pointer' }}
                >
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
