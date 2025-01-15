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

const User = mongoose.model('credentials', userSchema);

async function encryptExistingUsers() {
  try {
    const users = await User.find();

    for (const user of users) {
      // Verificar si ya están cifrados (puedes ajustar esta lógica si es necesario)
      if (!user.password.startsWith('$2b$') || !user.username.startsWith('$2b$')) {
        console.log(`Cifrando usuario: ${user.username}`);

        // Cifrar contraseña
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        // Cifrar username si lo deseas
        const hashedUsername = await bcrypt.hash(user.username, 10);
        user.username = hashedUsername;

        await user.save();
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

encryptExistingUsers();
