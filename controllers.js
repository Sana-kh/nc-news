const {fetchTopics, fetchEndpoints, selectArticleById, selectArticles, selectCommentsByArticleId, addComment, updateArticleVotes, deleteCommentById, selectUsers}= require("./models")
const db = require('./db/connection')

function getTopics(req, res, next){

    fetchTopics().then((topics) => {
        
        res.status(200).send({topics})
    })

    .catch((err) =>{
        next(err);
    })
}

function getEndpoints(req, res, next){
    fetchEndpoints().then((endpoints) => {
        res.status(200).send(endpoints)
    })
    .catch((err) => {
        next (err)
    })
}

function getArticleById (req, res, next) {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    })
  };

function getArticles (req, res, next) {
  const { topic } = req.query;
  const selectArticlesQuery= selectArticles(topic)
  const queries= [selectArticlesQuery];
  if(topic){
    const topicExistenceQuery= checkTopicExists(topic);
    queries.push(topicExistenceQuery);
  }
  Promise.all(queries).then((response) => {
    const articles= response[0]
    res.status(200).send({articles})
  })
    .catch((err) =>{
      console.log(err)
        next(err);
    })
  }

function checkTopicExists (topic){
  return db.query(`SELECT * FROM topics
  WHERE slug = $1`, [topic])
  .then(({rows}) => {
    if (rows.length ===0){
      return Promise.reject({ status: 404, msg: 'topic not found'})
    }
  })
}

 function getCommentsByArticleId (req, res, next) {
    const { article_id } = req.params;
  
    selectCommentsByArticleId(article_id)
      .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch((err) => {
        next(err);
      });
  };

  function postComments (req, res, next) {
    const article_id   = req.params.article_id;
    const newComment  = req.body;
  
    addComment(article_id, newComment)
      .then((comment) => {
        res.status(201).send({ comment: newComment });
      })
      .catch((err) => {
        next(err);
      });
  };

  function patchArticleVotes(req, res, next) {
    const  article_id  = req.params.article_id;
    const newVote = req.body;
  
    updateArticleVotes(article_id, newVote)
      .then((updatedArticle) => {
        res.status(200).send({ article: updatedArticle });
      })
      .catch((err) => {
        next(err);
      });
  }

  function deleteComment(req, res, next) {
    const { comment_id } = req.params;
  
    deleteCommentById(comment_id)
      .then(() => {
        res.status(204).end();
      })
      .catch((err) => {
        if (err.message === 'Comment not found') {
          res.status(404).send({ msg: err.message });
        } else {
          next(err);
        }
      });
  }

  function getUsers(req, res, next) {
    selectUsers()
      .then((users) => {
        res.status(200).send({ users });
      })
      .catch((err) => {
        next(err);
      });
  }
 
module.exports = {getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postComments, patchArticleVotes, deleteComment, getUsers}