const socketIo = require('socket.io')
const socketioJwt = require('socketio-jwt')

const jwtSecret = process.env.JWTSECRET || 'fakeSecret' // ./secret.txt

const guid = require('../data/guid')

const Matchup = require('../data/matchup')
const ChannelList = require('../data/channelList')

const User = require('../data/user')
const UserStorage = require('../data/userStorage')

let guestAccounts = new UserStorage()

let matchups = new ChannelList(Matchup)

function start (server) {
  const io = socketIo(server)
  const playersNS = io.of('/players')

  playersNS.use(socketioJwt.authorize({
    secret: jwtSecret,
    handshake: true
  }))

  playersNS.on('connection', (socket) => {
    console.log('connected', socket.id)
    console.log('socket.decoded_token', JSON.stringify(socket.decoded_token, null, 2))
    // console.log('socket token', socket.handshake.query.token)
    socket.emit('connection', socket.id)

    let user = guestAccounts.add(new User(/* userId */ socket.id, /* socket */ socket, socket.decoded_token))

    // send current public channels to this user
    announcePublicChannels(socket)

    // attempt to join an open channel
    joinOpenChannel(user)

    // enable joining arbitrary channel by name
    handleJoinNamedChannel(user)

    // choice selected by a player
    handleSelection(user)

    handleDisconnect(user)

    handleUsernameUpdate(user)
    // console.log('user list:', JSON.stringify(guestAccounts, null, 2))
  })

  function handleSelection (user) {
    user.socket.on('selection', (channelChoice) => {
      let chName = channelChoice.channel
      let choice = channelChoice.choice

      let matchUp = matchups.get(chName)
      // store user choice in channel
      matchUp.addSelection(user.id, choice)
      matchUp.sendChallengers()
      // console.log('user selections', JSON.stringify(matchUp.userSelections, undefined, 2))
      if (matchUp.allIn()) {
        // console.log('all in')
        // alert players after 1 second for a moderate delay
        setTimeout(() => {
          matchUp.sendSelections()
          matchUp.clearSelections()
        }, 1000)
      }
    })
  }

  function handleUsernameUpdate (user) {
    user.socket.on('username', value => {
      user.profile.username = value

      // update channels
      user.channels.forEach(channelName => {
        let matchUp = matchups.get(channelName)
        matchUp.sendChallengers()
      })
    })
  }

  function handleDisconnect (user) {
    user.socket.on('disconnect', () => {
      console.log('disconnected', user.socketId)
      // unjoin channel
      leaveChannels(user)
      // remove socket object
      guestAccounts.remove(user.socketId)
    })
  }

  function leaveChannels (user) {
    user.channels.forEach(channelName => {
      matchups.get(channelName).removeUser(user)
    })
  }

  // TODO: allow joinOpenChannel be triggered by the user
  // in addition to "on connect"
  // function handleJoinNewChannel (user) {}

  function handleJoinNamedChannel (user) {
    user.socket.on('join', channelName => {
      let channel = matchups.get(channelName)
      if (!channel.full()) {
        channel.addUser(user)
      } else {
        user.socket.emit('channel-not-joinable', channelName)
      }
    })
  }

  function joinOpenChannel (user) {
    // find an available channel
    let openChannel = matchups.findOpenChannel()

    if (openChannel) {
      openChannel.addUser(user)
    } else {
      // make new channel
      let name = guid()
      let newChannel = matchups.add(new Matchup(name, playersNS))

      // Publish channel list to all users when a channel is created
      announcePublicChannels(playersNS)

      newChannel.addUser(user)
    }
  }

  function announcePublicChannels (emitScope) {
    emitScope.emit('publicChannels', matchups.getNames())
  }
}

module.exports = start
