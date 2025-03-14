const endpoints = require('./endpoints.json');
const {
    fetchAllTopics,
    fetchArticleById,
    fetchAllArticles,
    fetchCommentsByArticleId,
    fetchAndPostCommentsByArticleId,
    fetchAndPatchArticlesById,
    fetchAndDeleteComments,
    fetchAllUsers,
    sortAndOrderArticles,
    filterByTopic,
    fetchUsersByUserName,
    fetchAndPatchCommentById,
    fetchAndPostArticles
} = require('./model');
const { checkExists } = require('./db/seeds/utils');
const { response } = require('./app');

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

    if (request.query.sort_by) {

        sortAndOrderArticles(request.query.sort_by, request.query.order)
            .then((articles) => {
                response.status(200).send({ articles })
            })
            .catch((err) => {
                next(err)
            })
    }
    else if (request.query.order) {
        sortAndOrderArticles(undefined, request.query.order)
            .then((articles) => {
                response.status(200).send({ articles })

            })
            .catch((err) => {
                next(err)
            })

    } else if (request.query.topic) {
        const topic = request.query.topic
        checkExists('topics', 'slug', topic)
            .then(() => {
                filterByTopic(topic).then((articles) => {
                    response.status(200).send({ articles })
                })

            }).catch((err) => {
                next(err)

            })
    }
    else {
        fetchAllArticles()
            .then((articles) => {
                response.status(200).send({ articles })
            }).catch((err) => {
                next(err)
            })
    }
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
};


const getUserByUserName = (request, response, next) => {
    const userName = request.params.username;


    checkExists('users', 'username', userName)
        .then(() => {
            fetchUsersByUserName(userName).then((users) => {
                response.status(200).send({ users })
            })

        }).catch((err) => {
            next(err)

        })
};

const patchCommentById = (request, response, next) => {
    const commentId = request.params.comment_id
    const { inc_votes } = request.body;


    checkExists('comments', 'comment_id', commentId)
        .then((res) => {

            const currentVote = res[0].votes;

            return { currentVote }
        })
        .then(({ currentVote }) => {


            return fetchAndPatchCommentById(currentVote, inc_votes, commentId);
        })
        .then((comments) => {

            response.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

const postAllArticles = (request, response, next) => {
    const { author, title, body, topic, article_img_url } = request.body;
    if (!author || !title || !body || !topic) {
        return response.status(400).send({ message: "Missing required fields" });
    }


    checkExists('users', 'username', author)
        .then(() => {
            return checkExists('topics', 'slug', topic);


        }).then(() => {

            return fetchAndPostArticles(author, title, body, topic, article_img_url)

        }).then((articles) => {

            response.status(201).send({ articles })

        }).catch((err) => {
            next(err)
        })
};




module.exports = {
    getAllEndpoints,
    getAllTopics,
    getArticleById,
    getAllArticles,
    getCommentsByArticleId,
    postCommentsByArticleId,
    patchArticleById,
    deleteCommentsById,
    getAllUsers,
    getUserByUserName,
    patchCommentById,
    postAllArticles
};