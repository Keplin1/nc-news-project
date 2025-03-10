const { response } = require("./app");
const endpoints = require('./endpoints.json');
const { fetchAllTopics } = require('./model')

const getAllEndpoints = (request, response, next) => {

    response.status(200).send({ endpoints }).catch((err) => {

        next(err)
    })

}
const getAllTopics = (request, response, next) => {

    fetchAllTopics().then((topics) => {

        response.status(200).send({ topics })

    })

}

module.exports = { getAllEndpoints, getAllTopics }