const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const captainRoutes = require('./routes/captain.routes');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
connectDB();
const rabbitMQ = require('./service/rabbit.js');
rabbitMQ.connectRabbitMQ();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', captainRoutes);

module.exports = app;