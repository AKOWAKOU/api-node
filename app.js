const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');
const app = express();
const port = 3000
// Middleware to log request
app.use(morgan('combined'));
// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://mongo-node-api:27017/node-api')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/tasks', taskRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
