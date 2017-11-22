/* global Vue */
Vue.component('player', {
  props: ['playerSelection'],
  template: `<div class="player">
    ({{playerSelection.username}})
    <div class="action">{{playerSelection.choice}}</div>
    <div>{{score}}</div>
  </div>`,
  computed: {
    score: function () {
      let score = ''
      if (this.playerSelection.score === undefined) {
        score = ''
      } else if (this.playerSelection.score > 0) {
        score = 'Result: Winner!'
      } else {
        score = 'Result: Lose!'
      }
      console.log('Player.js', 'print score', this.playerSelection.username, score)
      return score
    }
  }
})