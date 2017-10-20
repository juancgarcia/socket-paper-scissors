/* global Vue */
/* global socket */
/* global socketPromise */
socketPromise.then(socket => {
  Vue.component('app', {
    props: ['title', 'socket_id', 'channel', 'challenger_id', 'opponentSelection'],
    data: function () {
      return {
        selection: ''
      }
    },
    template: `<div>
      {{ title }}
      <matchup
        v-bind:challenger_id="challenger_id"
        v-bind:socket_id="socket_id"
        v-bind:selection="selection"
        v-bind:opponentSelection="opponentSelection"
        /></matchup>
      <hand-chooser
        v-on:selection="setSelection"
        ></hand-chooser>
      <div>Channel: {{ channel }}</div>
      </div>`,
    methods: {
      setSelection: function (choice) {
        this.selection = choice
        socket.emit('selection', choice)
      }
    }
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
      v-bind:opponentSelection="opponentSelection"
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
  socket.on('challengers', (challengerList) => {
    console.log('A new challenger approaches:', challengerList)
    let selfIndex = challengerList.indexOf(app.socket_id)
    challengerList.splice(selfIndex, 1)
    app.challenger_id = challengerList[0]
  })
  socket.on('selection', (opponentSelection) => {
    console.log('Opponent Selected:', opponentSelection)
    app.opponentSelection = opponentSelection
  })
})
