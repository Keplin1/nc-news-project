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

});

describe('404 ERROR: incorrect endpoints', () => {

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

describe('/api/articles', () => {
  test('GET 200: returns an array of article objects', () => {

    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;


        expect(articles.length).toEqual(10);
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

  });
  test('GET 200: /api/articles?limit returns a limited number of results', () => {

    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {

        const articles = body.articles;
        const total_count = body.total_count;
        expect(typeof total_count).toBe('number')
        expect(articles.length).toEqual(10);
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

});


describe('GET  /api/articles? (sorting queries)', () => {
  test('GET 200: /api/articles?sort_by= column_name : sorts the articles by the provided column name and ordered in default order ', () => {

    return request(app)
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy('title', {
          descending: true
        });
      })

  });

  test('GET 200: /api/articles?order=asc : returns the articles in ascending order and sorted by default value', () => {

    return request(app)
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toBeSortedBy('created_at', {
          ascending: true
        });
      });
  });

  test('GET 200: /api/articles?sort_by=column_name?order=asc : both sorts and orders the articles according to the provided values ', () => {

    return request(app)
      .get('/api/articles?sort_by=topic&order=asc')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toBeSortedBy('topic', {
          descending: false
        });
      })

  });

  test('ERROR 400: invalid query', () => {
    return request(app)
      .get('/api/articles?sort_by=reviews&order=asc')
      .expect(400)
      .then(({ body }) => {

        expect(body.message).toBe('Invalid sort or order value')
      })
  });
});


describe('/api/articles?topic= <topic_name>', () => {

  test('GET 200: returns articles filtered by selected topic', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles.length).toEqual(10);
        articles.forEach(article => {

          const { author, title, article_id, topic, created_at, votes, article_img_url } = article;
          expect(topic).toBe('mitch');
          expect(typeof author).toBe('string');
          expect(typeof title).toBe('string');
          expect(typeof article_id).toBe('number');
          expect(typeof created_at).toBe('string');
          expect(typeof votes).toBe('number');
          expect(typeof article_img_url).toBe('string')
          expect(typeof article.body).toBe('string')

        });


        expect(articles).toBeSortedBy('created_at', {
          descending: true
        });
      })


  });
  test('GET 200: returns an empy array if the topic is valid but does not have any articles', () => {

    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles.length).toBe(0);
        expect(typeof articles).toBe('object')

      })

  })
  test('ERROR 404: the topic can not be found in the database', () => {


    return request(app)
      .get('/api/articles?topic=doggos')
      .expect(404)
      .then(({ body }) => {

        expect(body.message).toBe('value not found')
      })

  })

})
















describe('GET /api/articles/:article_id', () => {
  test('200: retuns an individual object of a specific id ', () => {

    return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({ body }) => {

        const article = body.articles;


        const { article_id, title, topic, author, created_at, votes, article_img_url, comment_count } = article;

        expect(article_id).toBe(2);
        expect(typeof title).toBe('string');
        expect(typeof topic).toBe('string');
        expect(typeof author).toBe('string');
        expect(typeof article.body).toBe('string')
        expect(typeof created_at).toBe('string');
        expect(typeof votes).toBe('number');
        expect(typeof article_img_url).toBe('string')
        expect(typeof comment_count).toBe('number')

      })
  });
  test('200: retuns an individual object of a specific id with a total comment count', () => {

    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {

        const article = body.articles;

        const { article_id, title, topic, author, created_at, votes, article_img_url, comment_count } = article;

        expect(comment_count).toBe(11);
        expect(article_id).toBe(1);
        expect(typeof title).toBe('string');
        expect(typeof topic).toBe('string');
        expect(typeof author).toBe('string');
        expect(typeof article.body).toBe('string')
        expect(typeof created_at).toBe('string');
        expect(typeof votes).toBe('number');
        expect(typeof article_img_url).toBe('string')

      })
  });
  test('200: retuns an individual object of a specific id with the total comment count set to zero when the article has no comments', () => {

    return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({ body }) => {

        const article = body.articles;

        const { article_id, title, topic, author, created_at, votes, article_img_url, comment_count } = article;

        expect(comment_count).toBe(0);
        expect(article_id).toBe(2);
        expect(typeof title).toBe('string');
        expect(typeof topic).toBe('string');
        expect(typeof author).toBe('string');
        expect(typeof article.body).toBe('string')
        expect(typeof created_at).toBe('string');
        expect(typeof votes).toBe('number');
        expect(typeof article_img_url).toBe('string')

      })
  });

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
});


describe('POST /api/articles/:article_id/comments', () => {
  test('POST 201: respons with a newly posted comment object', () => {

    return request(app)
      .post('/api/articles/2/comments')
      .send({ username: "butter_bridge", body: 'the Office US is way better than the UKs version' })
      .expect(201)
      .then(({ body: responseBody }) => {
        const comment = responseBody.comments;
        const { author, body } = comment;
        expect(author).toBe("butter_bridge");
        expect(comment.body).toBe('the Office US is way better than the UKs version');
        expect(typeof author).toBe('string');
        expect(typeof body).toBe('string');

      })
  })

  test('ERROR 404: the username does not match the users data', () => {


    return request(app)
      .post('/api/articles/2/comments')
      .send({ username: "Michael_Scarn", body: 'the Office US is way better than the UKs version' })
      .expect(404)
      .then(({ body }) => {

        expect(body.message).toBe('value not found')

      })
  })

  test('POST ERROR 400: the username is valid but the body key is missing', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Missing required fields")

      })

  })
  test('POST ERROR 400: the username key is missing', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ body: 'the Office US is way better than the UKs version' })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Missing required fields")

      })
  })
  test('POST ERROR 404: returns an error message if the article_id is of valid format but does not exist', () => {
    return request(app)
      .post('/api/articles/700/comments')
      .send({ username: "butter_bridge", body: 'the Office US is way better than the UKs version' })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('value not found')

      })

  })
  test('POST ERROR 400: returns an error message if the article_id is of invalid format', () => {
    return request(app)
      .post('/api/articles/thousand/comments')
      .send({ username: "butter_bridge", body: 'the Office US is way better than the UKs version' })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: passed data is invalid")
      })
  })

})


describe('PATCH /api/articles/:article_id', () => {

  test('PATCH 200: responds with an updated article', () => {

    return request(app)
      .patch('/api/articles/2')
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {

        const article = body.articles;

        const { article_id, title, topic, author, created_at, votes, article_img_url } = article;

        expect(article_id).toBe(2);
        expect(votes).toBe(-100)
        expect(typeof title).toBe('string');
        expect(typeof topic).toBe('string');
        expect(typeof author).toBe('string');
        expect(typeof created_at).toBe('string');
        expect(typeof article.body).toBe('string')
        expect(typeof article_img_url).toBe('string');
      })
  })
  test('PATCH ERROR 400:  the input in the body is of invalid format', () => {

    return request(app)
      .patch('/api/articles/2')
      .send({ inc_votes: 'one' })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: passed data is invalid")
      })

  });
  test('PATCH ERROR 400: the input in the body is missing', () => {

    return request(app)
      .patch('/api/articles/2')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: passed data is invalid")
      })

  });
  test('ERROR 404: returns an error message if the article_id is of valid format but does not exist', () => {


    return request(app)
      .patch('/api/articles/2222')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('value not found')
      })
  });
  test('ERROR 400: returns an error message if the article_id is of invalid format', () => {


    return request(app)
      .patch('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: passed data is invalid")
      })
  });
});

describe('DELETE /api/comments/:comment_id', () => {

  test('204 delete: delets a comment by its id and responds with 204 status with no content', () => {
    return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then(({ body }) => {

        expect(typeof body.res).toBe('undefined');

      }).then(() => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            const comments = body.comments;
            expect(comments).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({ comment_id: 2 })
              ])
            );
          })
      })
  });
  test('DELETE ERROR 404: returns an error message if the comment_id is of valid format but does not exist', () => {


    return request(app)
      .delete('/api/comments/2000')
      .expect(404)
      .then(({ body }) => {

        expect(body.message).toBe('value not found')
      })
  });
  test('ERROR 400: returns an error message if the comments_id is of invalid format', () => {


    return request(app)
      .delete('/api/comments/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: passed data is invalid")
      })
  });


});

describe('GET /api/users', () => {
  test('200: responds with an array of user objects, each of which have username, name and avatar_url properties', () => {

    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const users = body.users;


        expect(users.length).toEqual(4);
        users.forEach(user => {

          const { username, name, avatar_url } = user;

          expect(typeof username).toBe('string');
          expect(typeof name).toBe('string');
          expect(typeof avatar_url).toBe('string');
        })
      })

  })
});


describe('GET /api/users/:username', () => {
  test('GET 200: returns a user object by its username', () => {

    return request(app)
      .get('/api/users/icellusedkars')
      .expect(200)
      .then(({ body }) => {

        const user = body.users


        const { username, avatar_url, name } = user;
        expect(username).toBe('icellusedkars');
        expect(typeof avatar_url).toBe('string');
        expect(typeof name).toBe('string');

      })

  });
  test('ERROR 404: responds with an error when passed a username that can not be found in the database', () => {

    return request(app)
      .get('/api/users/mariacallas')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('value not found')

      })
  })

})

describe('PATCH /api/comments/:comment_id', () => {

  test('PATCH 200: responds with an updated comment', () => {

    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: -17 })
      .expect(200)
      .then(({ body }) => {
        const comment = body.comments
        const { comment_id, article_id, votes, author, created_at } = comment;
        expect(comment_id).toBe(1);
        expect(votes).toBe(-1)
        expect(typeof article_id).toBe('number');
        expect(typeof author).toBe('string');
        expect(typeof created_at).toBe('string');
        expect(typeof comment.body).toBe('string')

      })
  });
  test('PATCH ERROR 400:  the input in the body is of invalid format', () => {

    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 'one' })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: passed data is invalid")
      })

  });
  test('PATCH ERROR 400: the input in the body is missing', () => {

    return request(app)
      .patch('/api/comments/1')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: passed data is invalid")
      })

  });
  test('ERROR 404: returns an error message if the comments_id is of valid format but does not exist', () => {


    return request(app)
      .patch('/api/articles/2222')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('value not found')
      })
  });
  test('ERROR 400: returns an error message if the article_id is of invalid format', () => {


    return request(app)
      .patch('/api/comments/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: passed data is invalid")
      })
  });
});

describe('POST /api/articles', () => {
  test('POST 201: respons with a newly posted article object', () => {

    return request(app)
      .post('/api/articles')
      .send({
        author: 'icellusedkars', title: "Threat level midnight",
        body: "The 25 minute 'movie version' features expanded scenes from Michael Scott's film 'Threat Level Midnight' and leaves out all the reactions in the office",
        topic: "paper", article_img_url: "https://images.pexels.com/photos/1/paper-office"
      })
      .expect(201)
      .then(({ body: responseBody }) => {

        const article = responseBody.articles;

        const { author, title, body, topic, article_img_url } = article;
        expect(author).toBe("icellusedkars");
        expect(body).toBe("The 25 minute 'movie version' features expanded scenes from Michael Scott's film 'Threat Level Midnight' and leaves out all the reactions in the office");
        expect(title).toBe("Threat level midnight");
        expect(topic).toBe('paper');
        expect(typeof article_img_url).toBe('string')


      })
  });

  test('POST 201: if the posted body does not include image_url then it gets set to the default value', () => {

    return request(app)
      .post('/api/articles')
      .send({
        author: 'icellusedkars', title: "Threat level midnight",
        body: "The 25 minute 'movie version' features expanded scenes from Michael Scott's film 'Threat Level Midnight' and leaves out all the reactions in the office",
        topic: "paper"
      })
      .expect(201)
      .then(({ body: responseBody }) => {
        const article = responseBody.articles;


        const { author, title, body, topic, article_img_url } = article;
        expect(author).toBe("icellusedkars");
        expect(body).toBe("The 25 minute 'movie version' features expanded scenes from Michael Scott's film 'Threat Level Midnight' and leaves out all the reactions in the office");
        expect(title).toBe("Threat level midnight");
        expect(topic).toBe('paper');
        expect(article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")


      })



  });
  test('ERROR 404: the author does not match the users data', () => {


    return request(app)
      .post('/api/articles')
      .send({
        author: "Michael_Scarn", title: "Threat level midnight",
        body: "The 25 minute 'movie version' features expanded scenes from Michael Scott's film 'Threat Level Midnight' and leaves out all the reactions in the office",
        topic: "paper"
      })
      .expect(404)
      .then(({ body }) => {

        expect(body.message).toBe('value not found')

      })
  })

  test('POST ERROR 404: the topic does not match the topics data', () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: 'icellusedkars', title: "Threat level midnight",
        body: "The 25 minute 'movie version' features expanded scenes from Michael Scott's film 'Threat Level Midnight' and leaves out all the reactions in the office",
        topic: "movies"
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("value not found")

      })

  })
  test('POST ERROR 400: a few of the keys, which do not have pre-defined default values are missing', () => {
    return request(app)
      .post('/api/articles')
      .send({ author: 'icellusedkars', title: "Threat level midnight" })
      .expect(400)
      .then(({ body }) => {

        expect(body.message).toBe("Missing required fields")

      })
  })

});


