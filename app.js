const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/userRoutes')
// Create an Express application
const app = express();
//configuration on prot
const port = 3000;
// Enable cors at the server side. 
const corsOption = {
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
}
// Enable CORS to handle cross-origin errors
app.use(cors(corsOption));

// Middleware to log requests
app.use(morgan('combined'));

// Middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://node-mongo:27017/node-api')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/users', userRoutes); 
app.use('/tasks', taskRoutes);
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
