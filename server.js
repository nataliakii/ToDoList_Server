const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/todolist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB', error));

app.use(cors());
//app.use(bodyParser.json());
//app.use(
//  bodyParser.urlencoded({
//    extended: true,
//  }),
//);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', authRoutes);

// Start the server
const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);

module.exports = app;
