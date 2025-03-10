const db = require("../../db/connection");
const format = require('pg-format');

function convertTimestampToDate({ created_at, ...otherProperties }) {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

function formatTopics(data) {
  return data.map((element) => {
    return [
      element.slug, element.description, element.img_url
    ]
  })
}
function formatUsers(data) {

  return data.map((element) => {
    return [element.username, element.name, element.avatar_url]
  })
}

function formatArticles(data) {
  // const formattedDate = convertTimestampToDate(data.created_at)
  return data.map((element) => {
    return [
      element.title,
      element.topic,
      element.author,
      element.body,
      convertTimestampToDate({ created_at: element.created_at }).created_at,
      element.votes,
      element.article_img_url
    ];
  });
}

function formatComments(articleData, userData, commentsData) {

  return commentsData.map((element) => {
    const articleTitle = articleData.find((article) => article.title === element.article_title).article_id;
    const userName = userData.find((user) => user.username === element.author).username

    return [
      articleTitle,
      element.body,
      element.votes,
      userName,
      convertTimestampToDate({ created_at: element.created_at }).created_at
    ]


  })

}

const checkExists = (tableName, column, value) => {

  const queryStr = format('SELECT * FROM %I WHERE %I = $1', tableName, column);

  return db.query(queryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: 'value not found' })
    }
    return rows;
  })
}



module.exports = { formatTopics, convertTimestampToDate, formatUsers, formatArticles, formatComments, checkExists }