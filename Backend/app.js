const express = require('express');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const reservationRouter = require('./routes/reservationRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const AppError = require("./utils/appError");
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // arba jūsų fronto adresas
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
    console.log("labas is middleware");
    req.requestTime = new Date().toISOString();
    next();
});

app.use((req, res, next) => {
    console.log("Hello from middleware");
    next();
});

app.use((req, res, next) => {
    console.log(req.requestTime);
    next();
});

app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/categories', categoryRouter);


app.all(/(.*)/, (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Something went very wrong!';
    
    res.status(statusCode).json({
        status: status,
        message: message,
    });
});

app.use((err, req, res, next) => {
    const errMessage = err.message || "Internal server Error";
    const statusCode = err.statusCode || 500;
    const errStatus = err.status || "error";
  
    res.status(statusCode).json({
      status: errStatus,
      message: errMessage,
      stack: err.stack,
    });
});

module.exports = app;