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

function start (server) {
  const io = socketIo(server)

  io.use(socketioJwt.authorize({
    secret: jwtSecret,
    handshake: true
  }))

  io.sockets.on('connection', (socket) => {
    console.log('connected', socket.id)
    console.log('socket.decoded_token', JSON.stringify(socket.decoded_token, null, 2))
    // console.log('socket token', socket.handshake.query.token)
    socket.emit('connection', socket.id)

    let user = guestAccounts.add(new User(/* userId */ socket.id, socket))

    // attempt to join an open channel
    joinOpenChannel(user, socket)

    // choice selected by a player
    handleSelection(socket)

    handleDisconnect(socket)
  })

  function handleSelection (socket) {
    socket.on('selection', (choice) => {
      // socket.broadcast.emit('selection', choice)
      guestAccounts.get(socket.id).channels.forEach(ch => {
        channels.get(ch).users.forEach(user => {
          // skip current user
          if (socket.id === user) {
            return
          }
          io.to(user).emit('selection', choice)
        })
      })
    })
  }

  function handleDisconnect (socket) {
    socket.on('disconnect', () => {
      console.log('disconnected', socket.id)
      // unjoin channel
      leaveChannels(socket)
      // remove socket object
      guestAccounts.remove(socket.id)
    })
  }

  function leaveChannels (leavingSocket) {
    guestAccounts.get(leavingSocket.id).channels.forEach(channelName => {
      // leave room/channel
      leavingSocket.leave(channelName)

      // abandon paring
      let departingChannel = channels.get(channelName)
      let index = departingChannel.users.indexOf(leavingSocket.id)
      departingChannel.users.splice(index, 1)

      // delete channel if empty
      channels.remove(departingChannel)

      console.log('channel list:', JSON.stringify(channels, null, 2))
    })
  }

  function joinOpenChannel (user, joiningSocket) {
    // find an available channel
    let openChannel = channels.findOpenChannel()

    if (openChannel) {
      addUserToChannel(openChannel, user, joiningSocket)
    } else {
      // make new channel
      let newChannel = channels.add(new Channel(undefined, channels.maxUsersPerChannel))
      addUserToChannel(newChannel, user, joiningSocket)
    }
  }

  function addUserToChannel (channel, user, socket) {
    // join the channel
    socket.join(channel.name)
    guestAccounts.get(user.id).channels.push(channel.name)

    socket.emit('channel', channel.name)
    channel.users.push(user.id)

    // announce opponents
    io.to(channel.name).emit('challengers', channel.users)

    console.log('channel list:', JSON.stringify(channels, null, 2))
  }
}

module.exports = start
