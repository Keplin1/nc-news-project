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
                    status: 400,
                    message: '400: id was not found'
                })
            }

            return rows;
        })
}

const fetchAllArticles = () => {

    return db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id):: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC').then(({ rows }) => {

        return rows
        console.log(rows)
    })

}

module.exports = { fetchAllTopics, fetchArticleById, fetchAllArticles }