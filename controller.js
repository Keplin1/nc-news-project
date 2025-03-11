const endpoints = require('./endpoints.json');
const {
    fetchAllTopics,
    fetchArticleById,
    fetchAllArticles,
    fetchCommentsByArticleId,
    fetchAndPostCommentsByArticleId,
    fetchAndPatchArticlesById,
    fetchAndDeleteComments,
    fetchAllUsers
} = require('./model');
const { checkExists } = require('./db/seeds/utils');

const getAllEndpoints = (request, response, next) => {
    response.status(200).send({ endpoints });
};

const getAllTopics = (request, response, next) => {
    fetchAllTopics()
        .then((topics) => {
            response.status(200).send({ topics })
        }).catch((err) => {
            next(err)
        })
};

const getArticleById = (request, response, next) => {
    const articleId = request.params.article_id;

    fetchArticleById(articleId)
        .then((articles) => {
            response.status(200).send({ articles })
        }).catch((err) => {
            next(err)
        })
};

const getAllArticles = (request, response, next) => {
    fetchAllArticles()
        .then((articles) => {
            response.status(200).send({ articles })
        }).catch((err) => {
            next(err)
        })
};

const getCommentsByArticleId = (request, response, next) => {
    const articleId = request.params.article_id;
    checkExists('articles', 'article_id', articleId)
        .then(() => {
            fetchCommentsByArticleId(articleId)
                .then((comments) => {
                    response.status(200).send({ comments })
                })
        }).catch((err) => {
            next(err)
        });
};

const postCommentsByArticleId = (request, response, next) => {
    const articleId = request.params.article_id;
    const { username, body } = request.body;
    if (!username || !body) {
        return response.status(400).send({ message: "Missing required fields" });
    }
    checkExists('articles', 'article_id', articleId)
        .then(() => {
            return checkExists('users', 'username', username);
        })
        .then(() => {
            return fetchAndPostCommentsByArticleId(articleId, username, body);
        })
        .then((comments) => {
            response.status(201).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

const patchArticleById = (request, response, next) => {
    const articleId = request.params.article_id;
    const { inc_votes } = request.body;

    checkExists('articles', 'article_id', articleId)
        .then((res) => {
            const currentVote = res[0].votes;
            return { currentVote }
        })
        .then(({ currentVote }) => {

            return fetchAndPatchArticlesById(currentVote, inc_votes, articleId);
        })
        .then((articles) => {

            response.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

const deleteCommentsById = (request, response, next) => {
    const commentId = request.params.comment_id;


    checkExists('comments', 'comment_id', commentId)
        .then(() => {
            fetchAndDeleteComments(commentId).then((res) => {
                response.status(204).send({ res })
            })
        }).catch((err) => {
            next(err);
        });

};

const getAllUsers = (request, response, next) => {
    fetchAllUsers()
        .then((users) => {
            response.status(200).send({ users })
        }).catch((err) => {
            next(err)
        })
}

module.exports = {
    getAllEndpoints,
    getAllTopics,
    getArticleById,
    getAllArticles,
    getCommentsByArticleId,
    postCommentsByArticleId,
    patchArticleById,
    deleteCommentsById,
    getAllUsers
};