const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const endpoints = require("../endpoints.json")

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});
describe("404 error handler", () =>{
    test("404: responds with appropriate message when route does not exist", () => {
        return request(app)
            .get("/api/something")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("route does not exist")
            })
      })
})
describe("GET /api/topics", () => {
  test("200: responds with array of topic objects ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
            expect(topic).toHaveProperty('slug');
            expect(topic).toHaveProperty('description');
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");         
        });
     });
  });
});

describe("get /api", () =>{
    test("responds with an object describing all the available endpoints on API", () =>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    })
})

describe("GET /api/articles/:article_id", () => {
    test("responds with an article object", () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
                expect(body.article.article_id).toBe(1);
                expect(body.article.title).toBe('Living in the shadow of a great man');
                expect(body.article.topic).toBe('mitch');
                expect(body.article.author).toBe('butter_bridge');
                expect(body.article.body).toBe('I find this existence challenging');
                //expect(body.article.created_at).toEqual(JSON.parse(JSON.stringify(new Date (1594329060000))));
                expect(body.article.votes).toBe(100);
                expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
      });
    })
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('article not found');
          });
      });
      test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-an-article')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
})

describe("GET /api/articles", () => {
    test("responds with an array of article objects", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          articles.forEach((article) => {
              expect(article).toHaveProperty('author');
              expect(article).toHaveProperty('title'); 
              expect(article).toHaveProperty('article_id');
              expect(article).toHaveProperty('topic'); 
              expect(article).toHaveProperty('created_at'); 
              expect(article).toHaveProperty('votes');
              expect(article).toHaveProperty('article_img_url');
              expect(article).toHaveProperty('comment_count');          
          });
       });
    })
    test("articles should be sorted by date in ascending order", () => {
        return request(app)
        .get("/api/articles")
        .then(({body}) =>{
            const { articles } = body;
          expect(articles).toBeSortedBy('created_at', {descending : true})
        })
      })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("responds with an array of comments for the given article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body
            expect(Array.isArray(comments)).toBe(true);
            comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('body');
                expect(comment).toHaveProperty('article_id');        
            });
            //comments should be served with the most recent comments first.
            expect(comments).toBeSortedBy('created_at', {descending : true})
          });
      });
      test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999/comments')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('article not found');
          });
      });
      test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-an-article-id/comments')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
})

describe("POST /api/articles/:article_id/comments", () => {
    const newComment = { username: 'butter_bridge',body: 'This is a test comment' }
    test('responds with the posted comment', () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            expect(body.comment).toEqual({ username: 'butter_bridge',body: 'This is a test comment' })
        })
    })
    test('responds with a 400 error when article_id is invalid or does not exist', () => {
        return request(app)
          .post(`/api/articles/invalid_id/comments`)
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
      test('responds with a 400 error when body is missing or either properties on the body are missing', () => {
        const invalidComment = { username: 'butter_bridge' }; 
        return request(app)
          .post(`/api/articles/1/comments`)
          .send(invalidComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('bad request');
          });
      });
      test('responds with a 400 error when wrong property names or invalid data types on body', () => {
        const invalidComment = { user: 'butter_bridge', comment_body: 'Invalid body' };
        return request(app)
          .post(`/api/articles/1/comments`)
          .send(invalidComment)
          .then((response) => {
            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('bad request');
          });
      });
      test('404 when providing a non-existent username', () => {
        const invalidComment = ({ username: 'non-existent', body: 'bla bla'})
        return request(app)
        .post(`/api/articles/1/comments`)
        .send(invalidComment)
        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.body.msg).toBe('author does not exist');
        });
      })
 
})
describe('PATCH /api/articles/article_id', () => {
  test('should update the votes in article', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(110);
      
      });
  });
  test('responds with a 400 error when article_id is invalid', () => {
    return request(app)
      .patch(`/api/articles/invalid_id`)
      .send({ inc_votes: 10 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
  test('responds with a 404 error when article_id does not exist', () => {
    return request(app)
      .patch(`/api/articles/99`)
      .send({ inc_votes: 10 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article not found');
      });
  });
  test('responds with a 400 error when body is missing or has an empty object', () => {
    return request(app)
    .patch(`/api/articles/1`)
    .send({})
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('invalid body');
    });
  })
  test('responds with a 400 error if the updated votes is below zero', () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: -200 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Votes cannot go below zero');
      });
  });
})