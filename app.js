const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const menuRoutes = require('./routes/menuRoutes'); // Rutas para el menú
const cors = require('cors');
const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb+srv://benja856:benja123456@cluster1.pxar9.mongodb.net/restaurantDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Inicia el servidor
app.listen(3001, () => {
  console.log('Server running on http://localhost:3000');
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});