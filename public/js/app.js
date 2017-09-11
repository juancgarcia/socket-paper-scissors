/* global Vue */
Vue.component('app', {
  props: ['title'],
  template: `<div>
    {{ title }}
    <matchup/></matchup>
    <hand-chooser></hand-chooser>
    </div>`
})

const app = new Vue({
  el: '#app',
  data: {
    titleText: `Let's play: Socket Paper Scissors!`
  },
  template: `<app v-bind:title="titleText"></app>`
})
