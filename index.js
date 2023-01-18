const express = require('express')
const request = require('request')
const imageType = require('image-type')
const LRU = require("lru-cache")

const app = express()
const port = process.env.PORT || 3000
const cache = new LRU({ max: 500, maxAge: 1000 * 60 * 60 })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/image', (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.status(400).send('No url provided')
  }

  if (!/^https?:\/\//.test(url)) {
    return res.status(400).send('Invalid url')
  }

  const cachedImage = cache.get(url)
  if (cachedImage) {
    res.set('Content-Type', cachedImage.type)
    res.send(cachedImage.data)
    return
  }

  request.get({ url, encoding: null }, (error, response, body) => {
    if (error) {
      if (error.code === 'ENOTFOUND') {
        return res.status(404).send('URL is dead or invalid')
      }

      console.error(error)
      return res.status(500).send('Server error')
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

      cache.set(url, { data: body, type: type.mime })
    })
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
