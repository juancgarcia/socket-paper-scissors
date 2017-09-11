const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.Server(app)
const io = socketIo(server)

app.set('port', process.env.PORT || 3001)

// app.get('/', (req, res) => {})

app.use('/', express.static('./public'))

io.on('connection', (socket) => {
  console.log('connected', socket.id)
})

const listener = server.listen(app.get('port'), (err)=>{
  if (err) console.error(err)
  console.log(`Listening on ${listener.address().port}`)
})
