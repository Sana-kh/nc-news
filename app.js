const express = require("express")
const {getTopics} = require("./controllers")

const app = express()

app.get("/api/topics", getTopics)

app.use((err, req, res, next) => {
    console.log('app')
    if (err && err.msg=== "Not Found") {
      res.status(404).send({ msg: err.msg });
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log('apppp')
    res.status(500).send({msg: "ERROR!!!!"})
    
})
module.exports = app;