exports.handleServerErrors = (err, request, response, next) => {

    if (err.status && err.message) {
        response.status(err.status).send({ message: err.message });
    }
    next(err)
}

exports.handlePsqlErrors = (err, request, response, next) => {
    if (err.code === '22P02') {
        response.status(404).send({ message: '404: passed data is invalid' })
    }
    next(err)
}