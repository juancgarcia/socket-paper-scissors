/* global Vue */
Vue.component('username', {
  props: ['inputUsername'],
  data: function () {
    return {
      editMode: false,
      username: null
    }
  },
  template: `<div
    >
    <input
      v-if="editMode"
      v-on:blur="toggleEdit()"
      v-model="username" placeholder="edit me">
    <button
      v-on:click="toggleEdit()"
      v-else>Change Username</button>
  </div>`,
  methods: {
    toggleEdit: function () {
      console.log('props', this.inputUsername)
      this.editMode = !this.editMode
      if (!this.username) {
        this.username = this.inputUsername
      }
    }
  },
  watch: {
    'username': function (val) {
      this.$emit('update', val)
    }
  }
})
