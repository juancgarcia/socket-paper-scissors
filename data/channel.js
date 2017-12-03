const guid = require('./guid')

class Channel {
  constructor (name = guid(), ioNS, minUsers, maxUsers = -1) {
    this.name = name
    this.ioNS = ioNS
    this.users = []
    this.minUsers = minUsers
    // -1 unlimited
    this.maxUsers = maxUsers
  }
  emit (evt, data) {
    this.ioNS.to(this.name).emit(evt, data)
  }
  waitingForUsers () {
    return this.users.length < this.minUsers
  }
  ready () {
    let underMax = (this.maxUsers === -1) ? true : this.users.length <= this.maxUsers
    return this.users.length >= this.minUsers && underMax
  }
  full () {
    if (this.maxUsers === -1) {
      return false
    }
    return this.users.length >= this.maxUsers
  }
  addUser (user) {
    // join the channel
    user.addChannel(this.name)
    // user.socket.emit('channel', this.name)
    user.sendChannels()
    if (!this.users.find(u => (u === user))) {
      this.users.push(user)
    }
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
