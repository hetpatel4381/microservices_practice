const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', userRoutes);

module.exports = app;