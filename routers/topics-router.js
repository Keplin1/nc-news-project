const topicsRouter = require("express").Router();
const { getAllTopics } = require('../controller')

topicsRouter.get("/", getAllTopics)


module.exports = topicsRouter;