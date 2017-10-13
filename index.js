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

let channels = {}

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
    // socket.broadcast.emit('selection', choice)
    socketList[socket.id].channels.forEach(ch => {
      channels[ch].users.forEach(user => {
        // skip current user
        if (socket.id == user) {
          return
        }
        io.to(user).emit('selection', choice)
      })
    })
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
  let namedChannel = findNamedChannel(name)

  if (canJoinChannel(namedChannel)) {
    return addUserToChannel(name, namedChannel, joiningSocket)
  }

  // otherwise find an available channel
  let otherName = Object.keys(channels).find(chName => (canJoinChannel(channels[chName])))
  if(channels[otherName]){
    addUserToChannel(otherName, channels[otherName], joiningSocket)
  } else {
    // make new channel
    let channelName = guid()
    let newChannel = {
      users: []
    }
    channels[channelName] = newChannel
    addUserToChannel(channelName, newChannel, joiningSocket)
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
    if (channels[channelName].users.length === 0) {
      delete channels[channelName]
    }
    console.log('channel list:', JSON.stringify(channels, null, 2))
  })
}

function addUserToChannel (name, channel, socket) {
  // join the channel
  socket.join(name)
  socketList[socket.id].channels.push(name)

  socket.emit('channel', name)
  channel.users.push(socket.id)

  // announce opponents
  io.to(name).emit('challengers', channel.users)

  console.log('channel list:', JSON.stringify(channels, null, 2))
}

function canJoinChannel (channel) {
  return channel && channel.users.length < maxUsersPerChannel
}

function findNamedChannel (name) {
  return channels[name]
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
