/* global Vue */
Vue.component('matchup', {
  props: ['socket_id', 'challenger_id', 'selection', 'opponentSelection', 'playerSelections'],
  template: `<div class="row matchup">
    <div class="me">
      ME <player
        v-bind:playerSelection="{id: socket_id, choice: selection}"
        ></player>
    </div>
    <div class="them">
      Results <player
          v-for="(item, index) in playerSelections"
          v-bind:playerSelection="item"
          v-bind:index="index"
          v-bind:key="item.id"
        ></player>
    </div>
  </div>`
})
