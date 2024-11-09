require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const axios = require('axios');
const menuRoutes = require('./routes/menuRoutes'); // Rutas para el menú
const cors = require('cors');
const app = express();

// Configurar el puerto y la URI de MongoDB desde el archivo .env
const PORT = process.env.PORT;
const mongoUri = process.env.MONGODB_URI;

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Configura la carpeta `public` para servir archivos estáticos
app.use(express.static('public'));

// Rutas
app.use('/api/menu', menuRoutes); // Monta las rutas de menú en "/api/menu"

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Manejador de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});



// Inicia el servidor
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});


// Conexión a MongoDB
mongoose.connect(mongoUri, {
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));
