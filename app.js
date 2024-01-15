const express = require("express")
const {getTopics, getEndpoints} = require("./controllers")

const app = express()

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.use((err, req, res, next) => {
    if (err && err.msg=== "Not Found") {
      res.status(404).send({ msg: err.msg });
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "ERROR!!!!"})
})

module.exports = app;