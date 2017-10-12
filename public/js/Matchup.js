/* global Vue */
Vue.component('matchup', {
  props: ['socket_id', 'challenger_id'],
  template: `<div class="row matchup">
    <div class="me">
      ME ({{socket_id}})<div class="action"></div>
    </div>
    <div class="them">
      THEM ({{challenger_id}})<div class="action"></div>
    </div>
  </div>`
})
