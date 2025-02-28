const db = require("../connection");
const format = require('pg-format');
const { formatTopics, formatUsers, formatArticles, formatComments } = require('./utils');

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // drop all tables
  await db.query("DROP TABLE IF EXISTS comments;");
  await db.query("DROP TABLE IF EXISTS articles;");
  await db.query("DROP TABLE IF EXISTS users;");
  await db.query("DROP TABLE IF EXISTS topics;");

  // create all tables
  await db.query(`CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY, 
      description VARCHAR NOT NULL,
      img_url VARCHAR (1000)
    );
  `);
  await db.query(`CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR(1000)
    );
  `);
  await db.query(`CREATE TABLE articles ( 
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(300) NOT NULL,
      topic VARCHAR REFERENCES topics(slug),
      author VARCHAR REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    );
  `);
  await db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY, 
      article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR REFERENCES users(username),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // insert data
  const formattedTopics = formatTopics(topicData);
  await db.query(format(`INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING*;`, formattedTopics));
  const formattedUsers = formatUsers(userData)
  await db.query(format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING*;`, formattedUsers));
  const formattedArticles = formatArticles(articleData);
  const articles = await db.query(format(`INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING*;`, formattedArticles));
  const formattedComments = formatComments(articles.rows, userData, commentData);
  await db.query(format(`INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L RETURNING*;`, formattedComments))
}




module.exports = seed;
