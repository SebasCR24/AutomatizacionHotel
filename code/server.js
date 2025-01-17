const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Añadido para cifrado de contraseñas

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
  role: String,
});

const User = mongoose.model('User', userSchema, 'Credentials');

// Registro de usuario con cifrado de credenciales
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Cifra la contraseña
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Ruta de Login con comparación de campos cifrados
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await User.find(); // Obtener todos los usuarios
    const user = await Promise.all(
      users.map(async (u) => ({
        match: await bcrypt.compare(username, u.username), // Comparar username
        data: u,
      }))
    ).then((results) => results.find((u) => u.match)?.data); // Obtener el usuario que coincide

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({ username: user.username, role: user.role });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});



// Middleware para verificar roles
const checkRole = (roles) => (req, res, next) => {
  const role = req.header('x-role');
  if (!role || !roles.includes(role)) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};

// Ruta para obtener el Menú del Día (admin y user pueden acceder)
app.get('/api/daily-menu', async (req, res) => {
  try {
    const collection = mongoose.connection.collection('DailyMenu');
    const menu = await collection.findOne({}, { sort: { updatedAt: -1 } });
    if (menu) {
      res.status(200).json(menu);
    } else {
      res.status(404).json({ message: 'No hay menú disponible.' });
    }
  } catch (error) {
    console.error('Error al obtener el menú del día:', error);
    res.status(500).json({ message: 'Error al obtener el menú del día.' });
  }
});

// Ruta para sobrescribir el Menú del Día (solo admin puede modificar)
app.put('/api/daily-menu', checkRole(['admin']), async (req, res) => {
  const { soup1, soup2, mainDish1, mainDish2, price } = req.body;

  try {
      const collection = mongoose.connection.collection('DailyMenu');
      const newMenu = {
          soup1: soup1 || null,
          soup2: soup2 || null,
          mainDish1: mainDish1 || null,
          mainDish2: mainDish2 || null,
          price: price !== null ? parseFloat(price) : null,
          updatedAt: new Date(),
      };

      const result = await collection.updateOne({}, { $set: newMenu }, { upsert: true });
      res.status(result.upsertedCount > 0 ? 201 : 200).json({
          message: result.upsertedCount > 0
              ? 'Menú del día creado exitosamente.'
              : 'Menú del día actualizado exitosamente.',
      });
  } catch (error) {
      console.error('Error al actualizar el menú del día:', error);
      res.status(500).json({ message: 'Error al actualizar el menú del día.' });
  }
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
