const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Conexión a MongoDB
mongoose.connect(
  'mongodb+srv://zuritadilan:Admin2024**@roomservice.co6kb.mongodb.net/HotelRiver?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

// Asegúrate de que el modelo apunta a la colección 'Credentials'
const User = mongoose.model('User', userSchema, 'Credentials');

async function encryptExistingUsers() {
  try {
    const users = await User.find(); // Obtener todos los usuarios

    for (const user of users) {
      let updated = false; // Bandera para verificar si hubo cambios

      // Verificar si el username ya está cifrado
      if (!user.username.startsWith('$2b$')) {
        console.log(`Cifrando usuario: ${user.username}`);
        const hashedUsername = await bcrypt.hash(user.username, 10);
        user.username = hashedUsername;
        updated = true; // Marcar como actualizado
      }

      // Verificar si el password ya está cifrado
      if (!user.password.startsWith('$2b$')) {
        console.log(`Cifrando contraseña de usuario: ${user.username}`);
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        updated = true; // Marcar como actualizado
      }

      if (updated) {
        await user.save(); // Guardar cambios en la base de datos
        console.log(`Usuario ${user._id} actualizado correctamente.`);
      } else {
        console.log(`Usuario ${user._id} ya está cifrado. Saltando...`);
      }
    }

    console.log('Cifrado completo.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al cifrar usuarios:', error);
    mongoose.connection.close();
  }
}

// Ejecutar función de cifrado
encryptExistingUsers();
