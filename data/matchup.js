const Channel = require('./channel')

class Matchup extends Channel {
  constructor (name, maxUsers) {
    super(name, 2)
  }
  createPromise (abandonOld = false) {
    if (this.promise && this.promise instanceof Promise && ) {}
      this.promise = new Promise( (resolve, reject) => {
      })
  }
}

module.exports = Matchup
