# Usar la imagen de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del frontend
COPY package*.json ./
COPY . .

# Instalar las dependencias y compilar la aplicación
RUN npm install
RUN npm run build

# Usar una imagen de servidor para servir el frontend
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Exponer el puerto que usa nginx
EXPOSE 80

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
