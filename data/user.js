class User {
  constructor (id, socket, profile) {
    this.id = id
    this.socket = socket
    this.socketId = socket.id
    this.profile = profile
    this.isGuest = true
    this.channels = []
  }
  emit (evt, data) {
    this.socket.emit(evt, data)
  }
  addChannel (channel) {
    this.socket.join(channel)
    if (this.channels.indexOf(channel) < 0) {
      this.channels.push(channel)
    }
  }
  sendChannels () {
    this.emit('userChannels', this.channels)
  }
}

module.exports = User
