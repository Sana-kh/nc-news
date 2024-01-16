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
      INNER JOIN topics ON articles.topic = topics.slug
      INNER JOIN users ON articles.author = users.username
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