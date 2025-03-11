const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const request = require('supertest');

const app = require("../app");
const { string } = require("pg-format");
const articles = require("../db/data/test-data/articles");
beforeEach(() => {
  return seed(data)

})

afterAll(() => {
  return db.end()

})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });


  test('404: if path not found, responds with an error message', () => {
    return request(app)
      .get('/app')
      .expect(404)
      .then(({ body }) => {
        const response = body.message;
        expect(response).toEqual('404: path not found')

      })

  })
});

describe('GET /api/topics', () => {
  test('200: responds with an array of topic objects, each of which have slug and description properties', () => {

    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;

        expect(topics.length).toEqual(3);
        topics.forEach(topic => {

          const { slug, description } = topic;

          expect(typeof slug).toBe('string');
          expect(typeof description).toBe('string')
        })
      })

  })

  test('404: if path not found, responds with an error message', () => {
    return request(app)
      .get('/api/topcs')
      .expect(404)
      .then(({ body }) => {
        const response = body.message;
        expect(response).toEqual('404: path not found')

      })
  })
});


describe('GET /api/articles/:article_id', () => {
  test('200: retuns an individual object of a specific id ', () => {


    return request(app)
      .get('/api/articles/4')
      .expect(200)
      .then(({ body }) => {

        const article = body.articles[0];

        const { article_id, title, topic, author, created_at, votes, article_img_url } = article;

        expect(article_id).toBe(4);
        expect(typeof title).toBe('string');
        expect(typeof topic).toBe('string');
        expect(typeof author).toBe('string');
        expect(typeof article.body).toBe('string')
        expect(typeof created_at).toBe('string');
        expect(typeof votes).toBe('number');
        expect(typeof article_img_url).toBe('string')

      })
  })

  test('ERROR 404: responds with an error message if id is of valid format but does not exist in the database', () => {

    return request(app)
      .get('/api/articles/400')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('404: id was not found')
      })
  })
  test('ERROR 400: responds with an error message if the id is not of a valid format', () => {

    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {


        expect(body.message).toBe('400: passed data is invalid')
      })
  })
});

describe('/api/articles', () => {
  test('GET 200: returns an array of article objects', () => {

    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;


        expect(articles.length).toEqual(13);
        articles.forEach(article => {

          const { author, title, article_id, topic, created_at, votes, article_img_url, comment_count } = article;
          expect(typeof author).toBe('string');
          expect(typeof title).toBe('string');
          expect(typeof article_id).toBe('number');
          expect(typeof topic).toBe('string');
          expect(typeof created_at).toBe('string');
          expect(typeof votes).toBe('number');
          expect(typeof article_img_url).toBe('string')
          expect(typeof comment_count).toBe('number')
          expect(article.body).toBe(undefined)

        });

        expect(articles).toBeSortedBy('created_at', {
          descending: true
        });
      })

  })
  test('404: if path not found, responds with an error message', () => {
    return request(app)
      .get('/api/articls')
      .expect(404)
      .then(({ body }) => {
        const response = body.message;
        expect(response).toEqual('404: path not found')

      })
  })

});


describe('/api/articles/:article_id/comments', () => {

  test('GET 200: returns an array of comments for a given article_id', () => {

    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        expect(articles.length).toEqual(13);
        comments.forEach(comment => {
          const { comment_id, votes, created_at, author, article_id } = comment;
          expect(typeof comment_id).toBe('number');
          expect(typeof votes).toBe('number');
          expect(typeof comment.body).toBe('string');
          expect(typeof author).toBe('string');
          expect(typeof created_at).toBe('string');
          expect(typeof votes).toBe('number');
          expect(article_id).toBe(1)
        });

        expect(comments).toBeSortedBy('created_at', {
          descending: true
        })
      })
  });

  test('GET 200: returns an empty array for comments when the article does not have any comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(0);
      })
  });

  test('ERROR 404: returns an error message if the article_id is of valid format but does not exist', () => {


    return request(app)
      .get('/api/articles/700/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('value not found')
      })
  });
  test('ERROR 400: returns an error message if the article_id is of invalid format', () => {


    return request(app)
      .get('/api/articles/one/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: passed data is invalid")
      })
  });
})



