const Channel = require('./channel')

class Matchup extends Channel {
  constructor (name, socketChannel, maxUsers) {
    super(name, socketChannel, 2)
    this.userSelections = {}
  }
  sendChallengers () {
    this.emit('challengers', this.getPlayers())
  }
  sendSelections () {
    this.emit('selections', this.getResults())
  }
  addUser (user) {
    Channel.prototype.addUser.call(this, user)
    this.sendChallengers()
  }
  removeUser (user) {
    Channel.prototype.removeUser.call(this, user)
    this.sendChallengers()
  }
  getSelection (userId) {
    return this.userSelections[userId]
  }
  getPlayers (wChoice = false) {
    return this.users.map(user => {
      return this.simplifyUser(user, wChoice)
    })
  }
  getResults () {
    let results = this.getPlayers(true)

    for (let i = 0; i < results.length; i++) {
      results[i].score = 0
      for (let j = 0; j < results.length; j++) {
        if (i !== j) {
          results[i].score += this.compare(results[i].choice, results[j].choice)
        }
      }
    }

    return results
  }
  compare (a, b) {
    // tie => loss
    // "my choice", "the choice I can beat"
    return [
      ['socket', 'scissors'], // socket beats scissors
      ['paper', 'socket'],    // paper beats socket
      ['scissors', 'paper']   // scissors beaps paper
    ].reduce((acc, pair) => {
      let win = a === pair[0] && b === pair[1]
      return acc + win
    }, 0)
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
  getUser (id) {
    return this.users.find(u => (u.id === id))
  }
  simplifyUser (user, wChoice = true) {
    let simple = {
      id: user.id,
      username: user.profile.username
    }
    if (wChoice) {
      simple.choice = this.getSelection(user.id)
    }
    return simple
  }
  // createPromise (abandonOld = false) {
  //   if (this.promise && this.promise instanceof Promise && ) {}
  //     this.promise = new Promise( (resolve, reject) => {
  //     })
  // }
}

module.exports = Matchup
