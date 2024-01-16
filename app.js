const express = require("express")
const {getTopics, getEndpoints, getArticleById} = require("./controllers")

const app = express()

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get('/api/articles/:article_id', getArticleById);


app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    }
    else{
        next(err)
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