const express = require('express');
const app = express();
app.use(express.json())
const { handleServerErrors, handlePsqlErrors } = require('./error.handlers')
const { getAllEndpoints, getAllTopics, getArticleById, getAllArticles, getCommentsByArticleId, postCommentsByArticleId } = require('./controller')

app.get('/api', getAllEndpoints);
app.get('/api/topics', getAllTopics)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postCommentsByArticleId)

app.use(handleServerErrors)
app.use(handlePsqlErrors)

app.all('*', (request, response, next) => {

    response.status(404).send({ message: '404: path not found' })

});


module.exports = app;