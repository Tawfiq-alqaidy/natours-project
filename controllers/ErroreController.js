const { render } = require('../app');
const AppError = require('../utils/appErrore');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value._id}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate value: ${err.keyValue.name}, Please use another value!`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((value) => value.message);
  const message = `Invalid input data, ${errors.join('.  ')}`;
  console.log(message);
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  const message = `Invalid token. Please log in again!`;
  return new AppError(message, 401);
};

const handleTokenExpiredError = () => {
  const message = `Your token is expired. Please log in again.`;
  return new AppError(message, 401);
};
const ErroreDevelopment = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // console.log('the error from here');
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err.message);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message || 'An unexpected error occurred!',
  });
};

const ErroreProduction = (err, req, res, next) => {
  // Operational, trusted error: send message to client
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    // send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });

    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    // send generic message
    res.status(err.statusCode).render('error', {
      title: 'error',
      msg: 'please try again late.',
    });
  }

  // B) RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message || 'An unexpected error occurred!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    ErroreDevelopment(err, req, res, next);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    // Handle specific errors
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err._message === 'Validation failed')
      error = handleValidatorErrorDB(error);
    if (err.name == 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (err.name == 'TokenExpiredError') error = handleTokenExpiredError();
    ErroreProduction(error, req, res, next);
  }
};
