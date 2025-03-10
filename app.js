const express = require('express');
const app = express();

const { getAllEndpoints, getAllTopics } = require('./controller')




app.get('/api', getAllEndpoints);
app.get('/api/topics', getAllTopics)


app.all('*', (request, response, next) => {

    response.status(404).send({ message: '404: path not found' })

})
module.exports = app;