/* global Vue */
/* global socket */
/* global socketPromise */
socketPromise.then(socket => {
  Vue.component('app', {
    props: ['title', 'playerSelection', 'channel', 'challengerSelections'],
    data: function () {
      return {
        selection: ''
      }
    },
    template: `<div>
      {{ title }}
      <matchup
        v-bind:playerSelection="playerSelection"
        v-bind:challengerSelections="challengerSelections"
        v-bind:channel="channel"
        v-on:selection="setSelection"
        /></matchup>
      <username
        v-bind:inputUsername="playerSelection.username"
        v-on:update="changeUsername">
      </username>
      </div>`,
    methods: {
      changeUsername: function (val) {
        this.playerSelection.username = val
        socket.emit('username', val)
      },
      setSelection: function (channelChoice) {
        socket.emit('selection', channelChoice)
      }
    }
  })

  const app = new Vue({
    el: '#app',
    data: {
      titleText: `Let's play: Socket Paper Scissors!`,
      playerSelection: {},
      channel: null,
      challengerSelections: []
    },
    template: `<app
      v-bind:title="titleText"
      v-bind:channel="channel"
      v-bind:playerSelection="playerSelection"
      v-bind:challengerSelections="challengerSelections"
      ></app>`
  })

  app.playerSelection = {username: privateData.jwtPayload.username}

  socket.on('connection', (socketId) => {
    console.log('Connected with id:', socketId)
    app.socketId = socketId
  })
  socket.on('channel', (channel) => {
    console.log('Joined channel:', channel)
    app.channel = channel
  })
  socket.on('challengers', (challengerList) => {
    console.log('A new challenger approaches:', JSON.stringify(challengerList, undefined, 2))
    let selfIndex = challengerList.findIndex(user => (app.playerSelection.username === user.username))
    challengerList.splice(selfIndex, 1)
    app.challengerSelections = challengerList
  })
  socket.on('selections', (playerSelections) => {
    console.log('Players Selected:', JSON.stringify(playerSelections, undefined, 2))
    let selfIndex = playerSelections.findIndex(user => (app.playerSelection.username === user.username))
    let currentPlayer = playerSelections.splice(selfIndex, 1)[0]
    app.playerSelection = currentPlayer
    app.challengerSelections = playerSelections
  })
})
