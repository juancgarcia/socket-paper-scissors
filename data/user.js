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
  sendChannels () {
    this.emit('userChannels', this.channels)
  }
}

module.exports = User
