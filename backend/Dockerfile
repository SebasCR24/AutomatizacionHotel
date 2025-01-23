# Usa una imagen de Node.js como base
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios para instalar las dependencias
COPY package*.json ./

# Instala las dependencias (incluido bcrypt)
RUN npm install

# Copia el resto de los archivos
COPY . .

# Instala bcrypt dentro del contenedor para que sea compatible
RUN npm rebuild bcrypt --build-from-source

# Expone el puerto que usa el backend
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
