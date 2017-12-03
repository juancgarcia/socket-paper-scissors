/* global Vue */
Vue.component('channel-list', {
  props: ['title', 'channels'],
  template: `<div>{{ title }}
    <ul class="channels">
      <li v-for="channel in channels">
        {{ channel }}
        <button
          v-on:click="joinChannel(channel)"
          >Join Channel</button>
      </li>
    </ul>
  </div>`,
  methods: {
    joinChannel: function (channel) {
      this.$emit('join', channel)
    }
  }
})
