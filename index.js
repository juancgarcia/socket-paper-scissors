const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.Server(app)
const io = socketIo(server)

app.set('port', process.env.PORT || 3001)

// app.get('/', (req, res) => {})

app.use('/', express.static('./public'))

let socketList = {}

let channels = []
let maxUsersPerChannel = 2

io.on('connection', (socket) => {
  console.log('connected', socket.id)
  socket.emit('connection', socket.id)

  socketList[socket.id] = {
    socket,
    channels: []
  }

  // attempt to join a channel
  joinAChannel(socket)

  // choice selected by a player
  socket.on('selection', (choice) => {
    socket.broadcast.emit('selection', choice)
  })

  socket.on('disconnect', () => {
    console.log('disconnected', socket.id)
    // unjoin channel
    leaveChannels(socket)
    // remove socket object
    delete socketList[socket.id]
  })
})

function joinAChannel (joiningSocket, name = 'defaultChannel') {
  let foundChannel = findAChannel(name)

  // don't break the channel limit
  if (canJoinChannel(foundChannel)) {
    addUserToChannel(foundChannel, joiningSocket)
  } else {
    // make new channel
    let newChannel = {
      name: guid(),
      users: []
    }
    channels.push(newChannel)
    addUserToChannel(newChannel, joiningSocket)
  }
}

function leaveChannels (leavingSocket) {
  socketList[leavingSocket.id].channels.forEach(channelName => {
    // leave room/channel
    leavingSocket.leave(channelName)
    // abandon paring
    let departingChannel = findNamedChannel(channelName)
    let index = departingChannel.users.indexOf(leavingSocket.id)
    departingChannel.users.splice(index, 1)
    // delete channel if empty
  })
}

function addUserToChannel (channel, socket) {
  // join the channel
  io.to(channel.name).emit('challenger', socket.id)

  socket.join(channel.name)
  socketList[socket.id].channels.push(channel.name)

  socket.emit('channel', channel.name)
  channel.users.push(socket.id)

  console.log('channel list:', JSON.stringify(channels, null, 2))
}

function canJoinChannel (channel) {
  return channel && channel.users.length < maxUsersPerChannel
}

function findAChannel (name) {
  let namedChannel = findNamedChannel(name)

  if (namedChannel && canJoinChannel(namedChannel)) {
    return namedChannel
  } else {
    return channels.find(ch => (canJoinChannel(ch)))
  }
}

function findNamedChannel (name) {
  return channels.find(ch => (ch.name === name))
}

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

const listener = server.listen(app.get('port'), (err)=>{
  if (err) console.error(err)
  console.log(`Listening on ${listener.address().port}`)
})
