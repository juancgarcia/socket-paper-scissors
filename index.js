const express = require('express')
const http = require('http')

const app = express()
const server = http.Server(app)
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWTSECRET || 'fakeSecret' // ./secret.txt

const SillyName = require('./lib/silly')
const sng = new SillyName({textMode: 'TitleCase'})

require('./game/sps')(server)

app.set('port', process.env.PORT || 3001)

// app.get('/', (req, res) => {})

app.use('/', express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/login', function (req, res) {
  // TODO: validate the actual user user
  var profile = {
    username: req.body.username || sng.generate(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  }

  // we are sending the profile in the token
  var token = jwt.sign(profile, jwtSecret, { expiresIn: 60 * 5 })

  res.json({token: token})
})

const listener = server.listen(app.get('port'), (err) => {
  if (err) console.error(err)
  console.log(`Listening on ${listener.address().port}`)
})
