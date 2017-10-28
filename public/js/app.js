/* global Vue */
/* global socket */
/* global socketPromise */
socketPromise.then(socket => {
  Vue.component('app', {
    props: ['title', 'username', 'channel', 'challenger_id', 'playerSelections'],
    data: function () {
      return {
        selection: ''
      }
    },
    template: `<div>
      {{ title }}
      <matchup
        v-bind:challenger_id="challenger_id"
        v-bind:username="username"
        v-bind:selection="selection"
        v-bind:playerSelections="playerSelections"
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
      username: null,
      challenger_id: null,
      channel: null,
      playerSelections: null
    },
    template: `<app
      v-bind:title="titleText"
      v-bind:username="username"
      v-bind:channel="channel"
      v-bind:challenger_id="challenger_id"
      v-bind:playerSelections="playerSelections"
      ></app>`
  })
  
  app.username = privateData.jwtPayload.username

  socket.on('connection', (socketId) => {
    console.log('Connected with id:', socketId)
    app.socketId = socketId
  })
  socket.on('channel', (channel) => {
    console.log('Joined channel:', channel)
    app.channel = channel
  })
  socket.on('challengers', (challengerList) => {
    console.log('A new challenger approaches:', challengerList)
    let selfIndex = challengerList.indexOf(app.username)
    challengerList.splice(selfIndex, 1)
    app.challenger_id = challengerList[0]
  })
  socket.on('selections', (playerSelections) => {
    console.log('Players Selected:', playerSelections)
    app.playerSelections = playerSelections
  })
})
