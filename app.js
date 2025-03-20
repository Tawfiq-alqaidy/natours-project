const express = require('express');
const app = express();
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// IMPORT THE MORGAN PAKGE TO SHOW THE REQUISTS THAT HAPPEN TO API
const morgan = require('morgan');
// IMPORT THE TOURS ROUTE
const tourRouter = require(`./routes/tourRoutes`);
// IMPORT THE USERS ROUTE
const usersRouter = require('./routes/userRoutes');
//IMPORT THE REVIEW ROUTE
const reviewRoute = require('./routes/reviewsRoutes');
// IMPORT APP ERRORE HANDLER
const AppError = require('./utils/appErrore');
// IMPORT ERRORE CONTROLLER handler
const globalErrorHandler = require('./controllers/ErroreController');
const { title } = require('process');
// IMPORT VIEWS ROUTER
const veiwsRouter = require('./routes/viewsRouter');

// 1)Global MIDDLEWARES

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static
app.use(express.static(path.join(__dirname, 'public')));

// security http headers
app.use(helmet());

//development loggong
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// body parser , reading the data from body to req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// cookie parser
app.use(cookieParser());

//Data sanitization against NoSql query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// limit the number of requests from one ip in an hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!!',
});

// Routes
app.use('/api', limiter);

// Middleware to log cookies
app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// MAKE THE ROUTE MIDDELWARE
app.use('/', veiwsRouter);
//MAKE TOUR ROUTE MIDDLE WARE
app.use(`/api/v1/tours`, tourRouter);

//MAKE USER ROUTE MIDDLE WARE
app.use(`/api/v1/Users`, usersRouter);

// MAKE REVIEW ROUTE MIDDLE WARE
app.use(`/api/v1/reviews`, reviewRoute);

// MIDDLE WARE FOR ANY UNCORRECT URLS!!
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
