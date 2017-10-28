class User {
  constructor (id, socket, profile) {
    this.id = id
    this.socketId = socket.id
    this.profile = profile
    this.isGuest = true
    this.channels = []
  }
}

module.exports = User
