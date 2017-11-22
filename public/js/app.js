/* global Vue */
/* global privateData */
/* global socketPromise */
socketPromise.then(socket => {
  Vue.component('app', {
    props: [ 'title', 'userId', 'inputUsername', 'channels', 'channelNames' ],
    data: function () {
      return {
        username: this.inputUsername
      }
    },
    render: function (createElement) {
      return createElement(
        'div',
        [].concat(
          this._v(this.title),
          this._v(this.username),
          this._v(this.userId),
          this.channels.map(channelData => (
            this.createAGame(createElement, channelData)
          )),
          createElement('username', {
            props: {
              inputUsername: this.username
            },
            on: {
              update: this.changeUsername
            }
          })
        )
      )
    },
    methods: {
      createAGame: function (createElement, channelData) {
        return createElement('matchup', {
          props: {
            playerId: this.userId,
            players: channelData.players,
            channel: channelData.channel
          },
          on: {
            selection: this.setSelection
          }
        })
      },
      changeUsername: function (val) {
        this.username = val
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
      username: privateData.jwtPayload.username,
      userId: null,
      channels: [],
      channelNames: []
    },
    template: `<app
      v-bind:title="titleText"
      v-bind:inputUsername="username"
      v-bind:userId="userId"
      v-bind:channels="channels"
      v-bind:channelNames="channelNames"
      ></app>`
  })

  socket.on('connection', (socketId) => {
    console.log('Connected with id:', socketId)
    app.userId = socketId
  })

  socket.on('userChannels', (channels) => {
    console.log('Joined channels:', channels)
    app.channelNames = channels
  })

  let applyChannelData = channelData => {
    let channel = channelData.channel

    app.channels = app.channels || []
    app.channelNames = app.channelNames || []

    // new channel?
    if (app.channelNames.indexOf(channel) < 0) {
      app.channelNames.push(channel)
      app.channels.push(channelData)
    } else {
      // existing channel
      let idx = app.channels.findIndex(channelObj => (channel === channelObj.channel))
      app.channels.splice(idx, 1)
      app.channels.push(channelData)
    }
  }

  socket.on('challengers', (challengerList) => {
    console.log('New challengers approach:', JSON.stringify(challengerList, undefined, 2))
    applyChannelData(challengerList)
  })

  socket.on('selections', (playerSelections) => {
    console.log('Players Selected:', JSON.stringify(playerSelections, undefined, 2))
    applyChannelData(playerSelections)
  })
})
