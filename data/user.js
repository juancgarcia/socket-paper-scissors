class User {
  constructor (id, socket) {
    this.id = id
    this.socketId = socket.id
    this.isGuest = true
    this.channels = []
  }
}

module.exports = User
