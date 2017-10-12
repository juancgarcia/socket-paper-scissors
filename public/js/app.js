/* global Vue */
Vue.component('app', {
  props: ['title', 'socket_id', 'channel', 'challenger_id', 'opponentSelection'],
  template: `<div>
    {{ title }}
    <matchup
      v-bind:challenger_id="challenger_id"
      v-bind:socket_id="socket_id"
      /></matchup>
    <hand-chooser></hand-chooser>
    <div>Channel: {{ channel }}</div>
    </div>`
})

const app = new Vue({
  el: '#app',
  data: {
    titleText: `Let's play: Socket Paper Scissors!`,
    socket_id: null,
    challenger_id: null,
    channel: null,
    opponentSelection: null
  },
  template: `<app
    v-bind:title="titleText"
    v-bind:socket_id="socket_id"
    v-bind:channel="channel"
    v-bind:challenger_id="challenger_id"
    ></app>`
})

socket.on('connection', (socket_id) => {
  console.log('Connected with id:', socket_id)
  app.socket_id = socket_id
})
socket.on('channel', (channel) => {
  console.log('Joined channel:', channel)
  app.channel = channel
})
socket.on('challenger', (challenger_id) => {
  console.log('A new challenger approaches:', challenger_id)
  app.challenger_id = challenger_id
})
socket.on('selection', (opponentSelection) => {
  console.log('Opponent Selected:', opponentSelection)
  app.opponentSelection = opponentSelection
})