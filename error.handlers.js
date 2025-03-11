exports.handleServerErrors = (err, request, response, next) => {

    if (err.status && err.message) {
        response.status(err.status).send({ message: err.message });
    }
    next(err)
}

exports.handlePsqlErrors = (err, request, response, next) => {
    if (err.code === '22P02') {
        response.status(400).send({ message: '400: passed data is invalid' })
    }
    next(err)
}

