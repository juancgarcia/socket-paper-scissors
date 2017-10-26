class Channel {
  constructor (name = guid(), maxUsers) {
    this.name = name
    this.users = []
    this.maxUsers = maxUsers
  }
  joinable () {
    return this.users.length < this.maxUsers
  }
}

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

module.exports = Channel
