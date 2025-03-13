const express = require('express');
const app = express();
app.use(express.json())
const { handleServerErrors, handlePsqlErrors } = require('./error.handlers')

const apiRouter = require("./routers/api-router");

app.use("/api", apiRouter);

app.use(handleServerErrors);
app.use(handlePsqlErrors);

app.all('*', (request, response, next) => {
    response.status(404).send({ message: '404: path not found' })
});

module.exports = app;