const db = require("./db/connection");

const fetchAllTopics = () => {

    return db.query('SELECT * FROM topics').then(({ rows }) => {
        return rows


    })

}
module.exports = { fetchAllTopics }