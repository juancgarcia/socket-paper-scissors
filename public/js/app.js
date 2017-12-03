/* global Vue */
/* global privateData */
/* global socketPromise */
socketPromise.then(socket => {
  Vue.component('app', {
    props: [ 'title', 'userId', 'inputUsername', 'channels', 'userChannels', 'publicChannels' ],
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
          createElement('channel-list', {
            props: {
              title: 'Public Channels',
              channels: this.publicChannels
            }
          }),
          // createElement('channel-list', {
          //   props: {
          //     title: 'User Channels',
          //     channels: this.userChannels
          //   }
          // }),
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
      userChannels: [],
      publicChannels: []
    },
    template: `<app
      v-bind:title="titleText"
      v-bind:inputUsername="username"
      v-bind:userId="userId"
      v-bind:channels="channels"
      v-bind:userChannels="userChannels"
      v-bind:publicChannels="publicChannels"
      ></app>`
  })

  socket.on('connection', (socketId) => {
    console.log('Connected with id:', socketId)
    app.userId = socketId
  })

  socket.on('userChannels', (channels) => {
    console.log('Joined channels:', channels)
    app.userChannels = channels
  })

  socket.on('publicChannels', (channels) => {
    console.log('Public channels:', channels)
    app.publicChannels = channels
  })

  let applyChannelData = channelData => {
    let channel = channelData.channel

    app.channels = app.channels || []
    app.userChannels = app.userChannels || []

    // new channel?
    if (app.userChannels.indexOf(channel) < 0) {
      app.userChannels.push(channel)
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
