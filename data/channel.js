const guid = require('./guid')

class Channel {
  constructor (name = guid(), ioNS, maxUsers) {
    this.name = name
    this.ioNS = ioNS
    this.users = []
    this.maxUsers = maxUsers
  }
  emit (evt, data) {
    this.ioNS.to(this.name).emit(evt, data)
  }
  joinable () {
    return this.users.length < this.maxUsers
  }
  addUser (user) {
    // join the channel
    user.socket.join(this.name)
    user.channels.push(this.name)
    // user.socket.emit('channel', this.name)
    user.sendChannels()
    this.users.push(user)
  }
  removeUser (user) {
    user.socket.leave(this.name)

    let index = user.channels.indexOf(this.name)
    user.channels.splice(index, 1)

    index = this.users.indexOf(user)
    this.users.splice(index, 1)
  }
}

module.exports = Channel
