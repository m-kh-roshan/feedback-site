require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/v1/users');
const featuresRouter = require('./routes/v1/features');
const errorMiddleware = require('./middlewares/error.middleware');
const AppError = require('./utilities/appError')
const setupSwagger = require('./utilities/swagger')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

setupSwagger(app)
console.log('📘 Swagger docs available at http://localhost:3001/api-docs');

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/features', featuresRouter);


app.use(function(req, res, next) {
  next(new AppError('Resource not found', 404, 'NOT_FOUND'));
});

// error handler
app.use(errorMiddleware);

module.exports = app;
