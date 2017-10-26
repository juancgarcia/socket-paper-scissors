class UserStorage {
  constructor () {
    this.store = {}
  }

  get (id) {
    return this.store[id]
  }

  add (user) {
    if (!this.get(user.id)) {
      this.store[user.id] = user
    }
    return user
  }

  remove (id) {
    delete this.store[id]
  }
}

module.exports = UserStorage
