/* global Vue */
Vue.component('player', {
  props: ['playerSelection'],
  template: `<div class="player">
    ({{playerSelection.username}})<div class="action">{{playerSelection.choice}}</div>
    <div>{{(playerSelection.score === undefined)? ("") : (playerSelection.score > 0) ? "Result: Winner!":"Result: Lose!"}}</div>
  </div>`
})