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
      .query(`SELECT articles.*,articles.created_at AT TIME ZONE 'UTC' as created_at, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
        [article_id])
      .then((result) => {
        const article = result.rows[0]
        if (!article) {
            return Promise.reject({status: 404, msg: 'article not found'})
        }
        return article;
        
      });
      
  };

  exports.selectArticles = (topic, sort_by='created_at', order='DESC') => {
    const validSortQueries = ['created_at', 'title', 'author', 'body', 'body', 'votes'];
    if(!validSortQueries.includes(sort_by)){
      return Promise.reject({status: 400, msg: 'invalid sort_by query'});
    }
    const validOrderQueries = ['DESC', 'ASC'];
    if(!validOrderQueries.includes(order)){
      return Promise.reject({status: 400, msg: 'invalid sort_by query'});
    }
    let query =  `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;
    const sqlParameters= []
    if (topic){
      query += ' WHERE topic = $1';
      sqlParameters.push(topic)
    }
    query += ` GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`;
  return db.query(query, sqlParameters)
  .then(({ rows }) => {
    return rows;
  });
  }

  exports.selectCommentsByArticleId = (article_id) => {
    return db.query(
      `SELECT comment_id, votes, created_at, author, body, article_id
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) =>{
        if (rows.length===0) {
            return Promise.reject({status: 404, msg: 'article not found'})
        }
        return rows;
    })
  };

  exports.addComment= (article_id, newComment) => {
    if (!newComment || !newComment.username || !newComment.body) {
        return Promise.reject({status: 400, msg: 'bad request'});
      }
      const { username, body } = newComment;
    return checkUsernameExists(newComment.username)
      .then((userExists) => {
        return db.query(
        `INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;`,
        [article_id, username, body]
        )
        .then(({ rows }) => newComment)
      })
  }
  function checkUsernameExists(username){
    return db.query('SELECT 1 FROM users WHERE username = $1;', [username])
    .then(({ rows }) => {
        if (rows.length ===0){
            return Promise.reject({ status: 404, msg: 'author does not exist'})
        }
        else {
            return rows.length > 0
        }
    });
  }

exports.updateArticleVotes = (articleId, newVote) => {
  if (!newVote || !newVote.inc_votes) {
    return Promise.reject({status: 400, msg: 'invalid body'});
  }
  const {inc_votes} = newVote
  return db.query(
    'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',
    [inc_votes, articleId]
  ).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'article not found'})
    }
       // Check if the updated votes are below zero
    const updatedVotes = rows[0].votes;
    if (updatedVotes < 0) {
      return Promise.reject({ status: 400, msg: 'Votes cannot go below zero'})
    }
    return rows[0];
  });
}

exports.deleteCommentById= (commentId) => {
  return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [commentId])
  .then(({ rows }) => {
    if (rows.length === 0) {
      throw new Error('Comment not found');
    }
  });
}

exports.selectUsers = () => {
  return db.query('SELECT * FROM users;')
  .then(({ rows }) => {
    return rows;
  });
}


