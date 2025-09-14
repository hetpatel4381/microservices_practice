const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const expressProxy = require('express-http-proxy');

const app = express();

module.exports = app;