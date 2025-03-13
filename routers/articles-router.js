const articlesRouter = require("express").Router();
const { getAllArticles,
    getArticleById,
    getCommentsByArticleId,
    postCommentsByArticleId,
    patchArticleById }
    = require('../controller')

articlesRouter.get("/", getAllArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticleById)
articlesRouter.route('/:article_id/comments').get(getCommentsByArticleId).post(postCommentsByArticleId);


module.exports = articlesRouter;