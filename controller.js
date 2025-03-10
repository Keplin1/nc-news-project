const { response } = require("./app");
const articles = require("./db/data/test-data/articles");
const endpoints = require('./endpoints.json');
const { fetchAllTopics, fetchArticleById, fetchAllArticles } = require('./model')

const getAllEndpoints = (request, response, next) => {
    response.status(200).send({ endpoints })
        .catch((err) => {
            next(err)
        })

}
const getAllTopics = (request, response, next) => {
    fetchAllTopics().then((topics) => {
        response.status(200).send({ topics })
    }).catch((err) => {
        next(err)
    })
}

const getArticleById = (request, response, next) => {
    const articleId = request.params.article_id;

    fetchArticleById(articleId).then((articles) => {
        response.status(200).send({ articles })
    }).catch((err) => {
        next(err)
    })
}

const getAllArticles = (request, response, next) => {
    fetchAllArticles().then((articles) => {
        response.status(200).send({ articles })

    }).catch((err) => {
        next(err)
    })


}

module.exports = { getAllEndpoints, getAllTopics, getArticleById, getAllArticles }