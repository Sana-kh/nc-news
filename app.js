const express = require("express")
const {getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postComments, patchArticleVotes, deleteComment} = require("./controllers")

const app = express()

app.use(express.json());

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComments);

app.patch('/api/articles/:article_id', patchArticleVotes);

app.delete('/api/comments/:comment_id', deleteComment);

app.all('*', (req, res) => {
    res.status(404).send( { msg: 'route does not exist'})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    }
    else{
        next(err)
    }
})
app.use((err, req, res, next) => {
    if (err.code === '23502'){
        res.status(400).send( { msg : 'votes can not be NULL'})
    } else {
        next (err)
    }
})
app.use((err,req,res,next) => {
    if (err.code === '22P02'){
        res.status(400).send( { msg : 'Bad request'})
    } else {
        next (err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "ERROR!!!!"})
})

module.exports = app;