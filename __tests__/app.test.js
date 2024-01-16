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
            // .then(({body}) => {
            //     console.log(body)
            //     expect(body.msg).toBe("Not Found")
            // })
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
