/* global Vue */
Vue.component('hand-chooser', {
  // props: ['todo'],
  template: `<div class="row choices">
    <div class="">
      <div class="option socket"
        v-on:click="select('socket')"
        ></div>
    </div>
    <div class="">
      <div class="option paper"
        v-on:click="select('paper')"
        ></div>
    </div>
    <div class="">
      <div class="option scissors"
        v-on:click="select('scissors')"
        ></div>
    </div>
  </div>`,
  methods: {
    select: function (choice) {
      console.log(choice)
      this.$emit(`selection`, choice)
    }
  }
})
