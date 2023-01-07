const express = require('express')
const request = require('request')
const imageType = require('image-type')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/image', (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.status(400).send('No url provided')
  }

  request.get({ url, encoding: null }, (error, response, body) => {
    if (error) {
      return res.status(500).send(error)
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      return res.status(response.statusCode).send('URL is dead or invalid')
    }

    Promise.resolve(imageType(body)).then((type) => {
      if (!type || !type.mime.startsWith('image/')) {
        return res.status(400).send('Invalid image file')
      }

      res.set('Content-Type', type.mime)
      res.send(body)
    })
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`))