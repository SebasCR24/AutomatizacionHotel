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
  'mongodb+srv://zuritadilan:Admin2024**@roomservice.co6kb.mongodb.net/hotel-app?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
}).on('error', (error) => {
  console.log('Error al conectar a MongoDB:', error);
});

// Esquema y Modelo de Usuario
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

const User = mongoose.model('credentials', userSchema); // Asegúrate de usar el nombre 'credentials'

// Rutas
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ username: user.username, role: user.role });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
