const db = require("./db/connection")
const fs = require('fs/promises')

exports.fetchTopics = () =>{
    return db.query(
        `SELECT * FROM topics;`
    )
    .then(({rows}) =>{
        return rows;
    })
}

exports.fetchEndpoints = () => {
    return fs.readFile("./endpoints.json", 'utf8')
    .then((fileContent) => JSON.parse(fileContent))
    .catch((error) => {
      console.error('Error reading endpoints file:', error);
    });
};

exports.selectArticleById = (article_id) => {
    return db
      .query(`SELECT * FROM articles
       WHERE article_id = $1;`,
        [article_id])
      .then((result) => {
        const article = result.rows[0]
        if (!article) {
            return Promise.reject({status: 404, msg: 'article not found'})
        }
        return article;
        
      });
      
  };

  exports.selectArticles = () => {
    return db.query (
        `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `)
        .then(({rows}) =>{
            return rows;
        })
        .catch((error) => {
            console.error('Error with SQL query:', error);
          });
  }