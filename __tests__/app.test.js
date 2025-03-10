const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const request = require('supertest');

const app = require("../app");
const { string } = require("pg-format");
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
        const response = body.message
        console.log(response)
        expect(response).toEqual('404: path not found')

      })

  })
});

describe('/api/topics', () => {
  test('GET 200: responds with an array of topic objects, each of which have slug and description properties', () => {

    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics
        console.log(body)

        expect(topics.forEach(topic => {

          const { slug, description } = topic;

          expect(typeof slug).toBe('string');
          expect(typeof description).toBe('string')


        }))
      })

  })

  test('404: if path not found, responds with an error message', () => {
    return request(app)
      .get('/app/topcs')
      .expect(404)
      .then(({ body }) => {
        const response = body.message
        console.log(response)
        expect(response).toEqual('404: path not found')

      })
  })

})