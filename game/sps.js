const socketIo = require('socket.io')
const socketioJwt = require('socketio-jwt')

const jwtSecret = process.env.JWTSECRET || 'fakeSecret' // ./secret.txt

const Channel = require('../data/channel')
const ChannelList = require('../data/channelList')

const User = require('../data/user')
const UserStorage = require('../data/userStorage')

let guestAccounts = new UserStorage()

let maxUsersPerChannel = 2

// let channels = {}
let channels = new ChannelList(maxUsersPerChannel)

let sockets = {}

function start (server) {
  const io = socketIo(server)

  io.use(socketioJwt.authorize({
    secret: jwtSecret,
    handshake: true
  }))

  io.sockets.on('connection', (socket) => {
    sockets[socket.id] = socket
    console.log('connected', socket.id)
    console.log('socket.decoded_token', JSON.stringify(socket.decoded_token, null, 2))
    // console.log('socket token', socket.handshake.query.token)
    socket.emit('connection', socket.id)

    let user = guestAccounts.add(new User(/* userId */ socket.id, socket))

    // attempt to join an open channel
    joinOpenChannel(user)

    // choice selected by a player
    handleSelection(user)

    handleDisconnect(user)
  })

  function handleSelection (user) {
    sockets[user.socketId].on('selection', (choice) => {
      // socket.broadcast.emit('selection', choice)
      guestAccounts.get(user.socketId).channels.forEach(ch => {
        // store user choice
        channels.get(ch).users.forEach(chUser => {
          // skip current user
          if (user.socketId === chUser.socketId) {
            return
          }
          io.to(chUser.socketId).emit('selection', choice)
        })
      })
    })
  }

  function handleDisconnect (user) {
    sockets[user.socketId].on('disconnect', () => {
      console.log('disconnected', user.socketId)
      // unjoin channel
      leaveChannels(user)
      // remove socket object
      guestAccounts.remove(user.socketId)
      delete sockets[user.socketId]
    })
  }

  function leaveChannels (user) {
    guestAccounts.get(user.socketId).channels.forEach(channelName => {
      // leave room/channel
      sockets[user.socketId].leave(channelName)

      // abandon paring
      let departingChannel = channels.get(channelName)
      let index = departingChannel.users.indexOf(user.socketId)
      departingChannel.users.splice(index, 1)

      // delete channel if empty
      channels.remove(departingChannel)

      console.log('channel list:', JSON.stringify(channels, null, 2))
    })
  }

  function joinOpenChannel (user) {
    // find an available channel
    let openChannel = channels.findOpenChannel()

    if (openChannel) {
      addUserToChannel(openChannel, user)
    } else {
      // make new channel
      let newChannel = channels.add(new Channel(undefined, channels.maxUsersPerChannel))
      addUserToChannel(newChannel, user)
    }
  }

  function addUserToChannel (channel, user) {
    // join the channel
    sockets[user.socketId].join(channel.name)
    guestAccounts.get(user.id).channels.push(channel.name)

    sockets[user.socketId].emit('channel', channel.name)
    channel.users.push(user)

    // announce opponents
    io.to(channel.name).emit('challengers', channel.users.map(u => u.id))

    console.log('channel list:', JSON.stringify(channels, null, 2))
  }
}

module.exports = start
