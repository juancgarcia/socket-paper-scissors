const Channel = require('./channel')

class Matchup extends Channel {
  constructor (name, maxUsers) {
    super(name, 2)
    this.userSelections = {}
  }
  getSelection (userId) {
    return this.userSelections[userId]
  }
  getSelections () {
    return Object.keys(this.userSelections).map(id => ({ id: id, choice: this.getSelection(id), username: this.getUser(id).profile.username }))
  }
  addSelection (userId, choice) {
    this.userSelections[userId] = choice
  }
  clearSelections () {
    for (let key in this.userSelections) {
      delete this.userSelections[key]
    }
  }
  allIn () {
    return Object.keys(this.userSelections).length === this.users.length
  }
  getUser(id) {
    return this.users.find(u => (u.id === id))
  }
  // createPromise (abandonOld = false) {
  //   if (this.promise && this.promise instanceof Promise && ) {}
  //     this.promise = new Promise( (resolve, reject) => {
  //     })
  // }
}

module.exports = Matchup
