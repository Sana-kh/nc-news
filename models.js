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

