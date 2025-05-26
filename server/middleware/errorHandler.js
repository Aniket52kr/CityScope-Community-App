// This middleware logs the request method, URL, and timestamp to the console:-
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};



// This middleware catches errors and sends a JSON response with the error message and stack trace if not in production:-
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

export { notFound, errorHandler };
