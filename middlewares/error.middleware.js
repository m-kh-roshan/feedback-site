const AppError = require('../utilities/appError')

module.exports = (err, req, res, next) => {
    console.error(err)

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            code: err.code,
            message: err.message
        })
    }

    return res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again later.'
    })
}