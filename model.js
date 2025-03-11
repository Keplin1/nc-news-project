const db = require("./db/connection");

const fetchAllTopics = () => {
    return db.query('SELECT * FROM topics').then(({ rows }) => {
        return rows
    })
}

const fetchArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    message: '404: id was not found'
                })
            }
            return rows;
        })
}

const fetchAllArticles = () => {
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
            ORDER BY articles.created_at DESC`)
        .then(({ rows }) => {
            return rows
        })

}

const fetchCommentsByArticleId = (article_id) => {
    return db.query(`
        SELECT * 
        FROM comments 
        WHERE article_id = $1 
        ORDER BY comments.created_at DESC`, [article_id])
        .then(({ rows }) => {
            return rows
        })
}


const fetchAndPostCommentsByArticleId = (article_id, username, body) => {


    return db.query(`INSERT INTO comments (author, body, article_id) 
     VALUES ($1, $2, $3)
     RETURNING *`,
        [username, body, article_id]
    ).then(({ rows }) => {

        return rows
    })

}


module.exports = {
    fetchAllTopics,
    fetchArticleById,
    fetchAllArticles,
    fetchCommentsByArticleId,
    fetchAndPostCommentsByArticleId
}