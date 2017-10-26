/* global Vue */
Vue.component('player', {
  props: ['playerSelection'],
  template: `<div class="player">
    ({{playerSelection.id}})<div class="action">{{playerSelection.choice}}</div>
  </div>`
})