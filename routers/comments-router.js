const commentsRouter = require('express').Router()
const { deleteCommentsById, patchCommentById } = require('../controller')


commentsRouter.route("/:comment_id").delete(deleteCommentsById).patch(patchCommentById)

module.exports = commentsRouter;