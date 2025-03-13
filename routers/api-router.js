const { getAllEndpoints } = require('../controller')
const apiRouter = require("express").Router();
const usersRouter = require('./users-router')
const articlesRouter = require('./articles-router');
const topicsRouter = require('./topics-router')
const commentsRouter = require('./comments-router')



apiRouter.get('/', getAllEndpoints);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter;