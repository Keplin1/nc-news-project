const commentsRouter = require('express').Router()
const { deleteCommentsById } = require('../controller')

commentsRouter.delete("/:comment_id", deleteCommentsById)

module.exports = commentsRouter;