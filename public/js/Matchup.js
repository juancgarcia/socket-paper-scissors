/* global Vue */
Vue.component('matchup', {
  props: ['playerSelection', 'channel', 'challengerSelections'],
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
  methods: {
    setSelection: function (choice) {
      this.selection = choice
      this.$emit(`selection`, {channel: this.channel, choice: choice})
    }
  }
})
