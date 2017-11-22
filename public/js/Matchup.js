/* global Vue */
Vue.component('matchup', {
  props: ['playerId', 'channel', 'players'],
  data: function () {
    return {
      selection: null
    }
  },
  template: `<div>
    <results
      v-bind:playerSelection="playerSelection"
      v-bind:challengerSelections="challengerSelections"
      /></results>
    <hand-chooser
      v-on:selection="setSelection"
      ></hand-chooser>
    <div>Channel: {{ channel }}</div>
    </div>`,
  computed: {
    playerSelection: function () {
      return this.processSelections().playerSelection
    },
    challengerSelections: function () {
      return this.processSelections().challengerSelections
    }
  },
  methods: {
    processSelections: function () {
      console.log('Matchup.js', 'computed values')
      let selfIndex = this.players.findIndex(user => (this.playerId === user.id))
      let playerSelection = { id: this.playerId }
      let challengerSelections = JSON.parse(JSON.stringify(this.players))
      if (selfIndex > -1) {
        playerSelection = challengerSelections.splice(selfIndex, 1)[0]
      }
      console.log('Matchup.js', 'challengerSelections', challengerSelections)
      console.log('Matchup.js', 'playerSelection', playerSelection)
      return {
        playerSelection,
        challengerSelections
      }
    },
    setSelection: function (choice) {
      this.selection = choice
      this.$emit(`selection`, {channel: this.channel, choice: choice})
    }
  }
})
