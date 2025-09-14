const dotenv = require('dotenv');
dotenv.config();

const rideRoutes = require('./routes/ride.routes.js');

const connectDB = require('./config/db');
connectDB();
const rabbitMQ = require('./service/rabbit');
rabbitMQ.connectRabbitMQ();

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", rideRoutes);

module.exports = app;