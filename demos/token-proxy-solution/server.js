const express = require('express')
const app = express()
const superagent = require('superagent')
const PORT = process.env.PORT || 3000

// export token as an environment variable
// 7ab4781d407be69eefc593b7b8487eaacd426449
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

// WARNING: if running locally node/nodemon must be run from SAME terminal tab where token exported

console.log('process.env', process.env)
app.use(express.static('./public'))


app.get('/github/*', (req, res) => {
    console.log('token', GITHUB_TOKEN)
    console.log('Routing a GitHub AJAX request for ', req.params[0]);
    const url = `https://api.github.com/${req.params[0]}`;
    superagent.get(url)
      .set(`Authorization`, `token ${GITHUB_TOKEN}`)
      .then(
        repos => res.send(repos.text),
        err => res.send(err)
      )
  })

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`))
