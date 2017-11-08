const guid = require('./guid')

class Channel {
  constructor (name = guid(), socketChannel, maxUsers) {
    this.name = name
    this.socket = socketChannel
    this.users = []
    this.maxUsers = maxUsers
  }
  joinable () {
    return this.users.length < this.maxUsers
  }
  addUser (user) {
    // join the channel
    user.socket.join(this.name)
    user.channels.push(this.name)
    user.socket.emit('channel', this.name)

    this.users.push(user)
    // announce opponents
    this.socket.emit('challengers', this.getPlayers())

    // console.log('channel list:', JSON.stringify(matchups, null, 2))
  }
}

module.exports = Channel
