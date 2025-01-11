const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(
  'mongodb+srv://zuritadilan:Admin2024**@roomservice.co6kb.mongodb.net/HotelRiver?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
}).on('error', (error) => {
  console.error('Error al conectar a MongoDB:', error);
});

// Esquema y Modelo de Usuario
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String, // Aunque no lo usemos ahora, lo dejamos aquí para el futuro
});

const User = mongoose.model('credentials', userSchema);

// Ruta de Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Datos recibidos:', { username, password });
    const user = await User.findOne({ username, password }); // Busca el usuario con las credenciales
    if (user) {
      res.status(200).json({ username: user.username, role: user.role });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// Ruta para sobrescribir el menú del día
app.put('/api/daily-menu', async (req, res) => {
  const { soup1, soup2, mainDish1, mainDish2, price } = req.body;

  if (!soup1 || !soup2 || !mainDish1 || !mainDish2 || !price) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const collection = mongoose.connection.collection('DailyMenu');
    const newMenu = {
      soup1,
      soup2,
      mainDish1,
      mainDish2,
      price: parseFloat(price),
      updatedAt: new Date(), // Fecha de la última actualización
    };

    // Sobrescribir el único documento existente o crearlo si no existe
    const result = await collection.updateOne(
      {}, // Filtro vacío para seleccionar el único documento
      { $set: newMenu }, // Sobrescribir el documento con los nuevos datos
      { upsert: true } // Crear el documento si no existe
    );

    if (result.upsertedCount > 0) {
      res.status(201).json({ message: 'Menú del día creado exitosamente.' });
    } else {
      res.status(200).json({ message: 'Menú del día actualizado exitosamente.' });
    }
  } catch (error) {
    console.error('Error al actualizar el menú del día:', error);
    res.status(500).json({ message: 'Error al actualizar el menú del día.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
