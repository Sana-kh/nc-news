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