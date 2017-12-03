/* global Vue */
Vue.component('channel-list', {
  props: ['title', 'channels'],
  template: `<div>{{ title }}
    <ul class="channels">
      <li v-for="channel in channels">
        {{ channel }}
      </li>
    </ul>
  </div>`
})
