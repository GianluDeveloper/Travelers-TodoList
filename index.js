const express = require('express')
const app = express()
const fs = require('fs')
const port = 3000
var bodyParser = require('body-parser')
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  }),
)

app.get('/', (req, res) => {
  fs.readFile('index.html', 'utf8', (err, data) => {
    if (err) {
      return
    }
    res.send(data)
  })
  //res.send('Hello World!')
})

app.get('/cached.json', (req, res) => {
  fs.readFile('cached.json', 'utf8', (err, data) => {
    if (err) {
      return
    }
    res.send(data)
  })
  //res.send('Hello World!')
})
app.get('/robots.txt', (req, res) => {
  res.type('plain')
  res.send('User-agent: *\nDisallow: /\n')
  //res.send('Hello World!')
})
app.post('/api', (req, res) => {
  const data = JSON.stringify(req.body)
  if (data) {
    fs.writeFile('cached.json', data, (err, data) => {
      if (err) {
        res.json({ ok: false, err: true })
        return
      }
      res.json({ ok: true })
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
