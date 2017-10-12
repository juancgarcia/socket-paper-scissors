/* global Vue */
Vue.component('matchup', {
  props: ['socket_id', 'challenger_id', 'selection', 'opponentSelection'],
  template: `<div class="row matchup">
    <div class="me">
      ME ({{socket_id}})<div class="action">{{selection}}</div>
    </div>
    <div class="them">
      THEM ({{challenger_id}})<div class="action">{{opponentSelection}}</div>
    </div>
  </div>`
})
