const express = require('express')
const port = 3000
const app = express()
const bodyParser = require('body-parser')
const parserMiddleware = bodyParser.json()
let count = 1

app.use(parserMiddleware)

app.listen(port, () => console.log('Listening to port 3000'))

const tooManyRequestMiddleware = ( req, res, next ) => {
  if (count > 5) {
    res.status(429).end()
  } else {
    next()
  }
}

app.post('/messages', tooManyRequestMiddleware, ( req, res ) => {
  if (req.body.text) {
    count++
    console.log('Posting text:',req.body.text)
    res.json( { "message": "Message received loud and clear" } )
  } else {
    res.status(400).end()
  }
})