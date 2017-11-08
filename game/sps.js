const socketIo = require('socket.io')
const socketioJwt = require('socketio-jwt')

const jwtSecret = process.env.JWTSECRET || 'fakeSecret' // ./secret.txt

const Matchup = require('../data/matchup')
const ChannelList = require('../data/channelList')

const User = require('../data/user')
const UserStorage = require('../data/userStorage')

let guestAccounts = new UserStorage()

let maxUsersPerChannel = 2

let matchups = new ChannelList(maxUsersPerChannel, Matchup)

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

    let user = guestAccounts.add(new User(/* userId */ socket.id, socket, socket.decoded_token))

    // attempt to join an open channel
    joinOpenChannel(user)

    // choice selected by a player
    handleSelection(user)

    handleDisconnect(user)

    handleUsernameUpdate(user)
    // console.log('user list:', JSON.stringify(guestAccounts, null, 2))
  })

  function handleSelection (user) {
    sockets[user.socketId].on('selection', (choice) => {
      // socket.broadcast.emit('selection', choice)
      // console.log('user selection', user.id, user.profile.username, choice)
      user.channels.forEach(chName => {
        let matchUp = matchups.get(chName)
        // store user choice in channel
        matchUp.addSelection(user.id, choice)
        io.to(chName).emit('selections', matchUp.getPlayers())
        // console.log('user selections', JSON.stringify(matchUp.userSelections, undefined, 2))
        if (matchUp.allIn()) {
          // console.log('all in')
          // alert players after 1 second for a moderate delay
          setTimeout(() => {
            io.to(chName).emit('selections', matchUp.getResults())
            matchUp.clearSelections()
          }, 1000)
        }
      })
    })
  }

  function handleUsernameUpdate(user) {
    sockets[user.socketId].on('username', value => {
      user.profile.username = value

      // update channels
      user.channels.forEach(channelName => {
        let matchUp = matchups.get(channelName)
        io.to(channelName).emit('challengers', matchUp.getPlayers())
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
      let departingChannel = matchups.get(channelName)
      let index = departingChannel.users.indexOf(user.socketId)
      departingChannel.users.splice(index, 1)

      // delete channel if empty
      matchups.remove(departingChannel)

      // console.log('channel list:', JSON.stringify(matchups, null, 2))
    })
  }

  function joinOpenChannel (user) {
    // find an available channel
    let openChannel = matchups.findOpenChannel()

    if (openChannel) {
      addUserToChannel(openChannel, user)
    } else {
      // make new channel
      let newChannel = matchups.add(new Matchup(undefined, matchups.maxUsersPerChannel))
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
    io.to(channel.name).emit('challengers', channel.getPlayers())

    // console.log('channel list:', JSON.stringify(matchups, null, 2))
  }
}

module.exports = start
