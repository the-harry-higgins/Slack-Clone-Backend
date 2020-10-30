// const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');

const routes = require('./routes');

const app = express();

const whitelist = ['http://localhost:3000']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      console.log('Accepted');
      callback(null, true);
    } else {
      console.log('Rejected');
      callback(new Error('Not allowed by CORS'));
    }
  }
}

app.use(cors(corsOptions));
app.use(helmet({ hsts: false }));
app.use(logger('dev'));
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use(function (_req, _res, next) {
  next(createError(404));
});

app.use(function (err, _req, res, _next) {
  res.status(err.status || 500);
  if (err.status === 401) {
    res.set('WWW-Authenticate', 'Bearer');
  }
  res.json({
    message: err.message,
    error: JSON.parse(JSON.stringify(err)),
  });
});

module.exports = app;
