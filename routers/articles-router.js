const articlesRouter = require("express").Router();
const { getAllArticles,
    getArticleById,
    getCommentsByArticleId,
    postCommentsByArticleId,
    patchArticleById,
    postAllArticles }
    = require('../controller')


articlesRouter.route('/').get(getAllArticles).post(postAllArticles)
articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleById)
articlesRouter.route('/:article_id/comments').get(getCommentsByArticleId).post(postCommentsByArticleId);


module.exports = articlesRouter;