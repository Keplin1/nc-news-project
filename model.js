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

module.exports = { fetchAllTopics, fetchArticleById }