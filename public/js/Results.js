/* global Vue */
Vue.component('results', {
  props: ['playerSelection', 'challengerSelections'],
  template: `<div class="row matchup">
    <div class="me">
      ME <player
        v-bind:playerSelection="playerSelection"
        ></player>
    </div>
    <div class="them">
      Challengers <player
          v-for="(item, index) in challengerSelections"
          v-bind:playerSelection="item"
          v-bind:index="index"
          v-bind:key="item.id"
        ></player>
    </div>
  </div>`
})
