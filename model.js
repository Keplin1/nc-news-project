const db = require("./db/connection");

const fetchAllTopics = () => {
    return db.query('SELECT * FROM topics').then(({ rows }) => {
        return rows
    })
};

const fetchArticleById = (id) => {
    return db.query(`
        SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`, [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    message: '404: id was not found'
                });
            }
            return rows[0];
        });
};

const fetchAllArticles = (limit = 10, offSet = 0) => {
    return db.query(`
            SELECT articles.author, 
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url, 
            COUNT(comments.comment_id)::INT AS comment_count 
            FROM articles 
            LEFT JOIN comments 
                ON articles.article_id = comments.article_id 
            GROUP BY articles.article_id 
            ORDER BY articles.created_at DESC
            LIMIT $1 OFFSET $2`, [limit, offSet])
        .then(({ rows }) => {
            return rows
        })

};

const fetchCommentsByArticleId = (article_id) => {
    return db.query(`
        SELECT * 
        FROM comments 
        WHERE article_id = $1 
        ORDER BY comments.created_at DESC`, [article_id])
        .then(({ rows }) => {
            return rows
        })
};

const fetchAndPostCommentsByArticleId = (article_id, username, body) => {
    return db.query(`INSERT INTO comments (author, body, article_id) 
     VALUES ($1, $2, $3)
     RETURNING *`,
        [username, body, article_id]
    ).then(({ rows }) => {

        return rows[0]
    })

};

const fetchAndPatchArticlesById = (currentVote, inc_votes, article_id) => {
    const updatedVote = currentVote + inc_votes;

    return db.query('UPDATE articles SET votes =$1 WHERE article_id =$2 RETURNING *', [updatedVote, article_id]).then(({ rows }) => {
        return rows[0]
    })
};

const fetchAndDeleteComments = (commentId) => {
    return db.query('DELETE FROM comments WHERE comment_id= $1', [commentId]).then(({ rows }) => {
        const response = rows[0]
        return response
    })
};

const fetchAllUsers = () => {
    return db.query('SELECT * FROM users').then(({ rows }) => {
        return rows
    })
};
const fetchUsersByUserName = (username) => {

    return db.query('SELECT users.* FROM users WHERE users.username= $1', [username]).then(({ rows }) => {
        return rows[0]

    })
}

const sortAndOrderArticles = (sortValue = 'created_at', orderValue = 'desc', limit = 10, offSet = 0) => {

    const allowedInputSort = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url', 'comment_count'];
    const allowedInputsOrder = ['asc', 'desc'];

    if (!allowedInputSort.includes(sortValue) || !allowedInputsOrder.includes(orderValue)) {
        return Promise.reject({ status: 400, message: "Invalid sort or order value" });
    } else {
        return db.query(`            
            SELECT articles.author, 
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url,  
            COUNT(comments.comment_id)::INT AS comment_count 
            FROM articles 
            LEFT JOIN comments 
                ON articles.article_id = comments.article_id 
            GROUP BY articles.article_id 
            ORDER BY ${sortValue} ${orderValue} 
            LIMIT $1 OFFSET $2`, [limit, offSet]).then(({ rows }) => {
            return rows
        })
    }
};


const filterByTopic = (topic, limit = 10, offSet = 0) => {
    return db.query('SELECT * FROM articles WHERE topic =$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [topic, limit, offSet]).then(({ rows }) => {
        return rows

    })

};
const fetchAndPatchCommentById = (currentVote, inc_votes, id) => {

    const updatedVotes = currentVote + inc_votes;
    return db.query('UPDATE comments SET votes =$1 WHERE comment_id= $2 RETURNING *', [updatedVotes, id]).then(({ rows }) => {
        return rows[0]

    })

}
const fetchAndPostArticles = (author, title, body, topic, article_img_url = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700") => {

    return db.query('INSERT into articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *', [author, title, body, topic, article_img_url]).then(({ rows }) => {
        return rows[0]

    })

}

module.exports = {
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
}