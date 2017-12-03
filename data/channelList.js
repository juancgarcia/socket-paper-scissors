const Channel = require('./channel')

class ChannelList {
  constructor (channelClass) {
    this.list = {}
    this.channelClass = channelClass || Channel
  }

  add (channel) {
    if (channel instanceof this.channelClass) {
      this.list[channel.name] = channel
    }
    return channel
  }

  getNames () {
    return Object.keys(this.list)
  }

  get (name) {
    return this.list[name]
  }

  findOpenChannel () {
    let channelName = Object.keys(this.list).find(chName => (this.needsUsers(this.list[chName])))
    return this.list[channelName]
  }

  needsUsers (channel) {
    return channel && channel instanceof Channel && channel.waitingForUsers()
  }

  remove (channel, force = false) {
    if (this.list[channel.name].users.length === 0 || force) {
      delete this.list[channel.name]
    }
  }
}

module.exports = ChannelList
