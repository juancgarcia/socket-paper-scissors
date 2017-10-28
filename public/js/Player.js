/* global Vue */
Vue.component('player', {
  props: ['playerSelection'],
  template: `<div class="player">
    ({{playerSelection.username}})<div class="action">{{playerSelection.choice}}</div>
  </div>`
})