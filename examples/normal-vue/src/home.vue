<template>
  <div>
    {{ msg }}
    <Hello />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  data() {
    return {
      msg: 'hello vue 3'
    }
  },

  methods: {
    hello(a: number) {
      console.log(a)
    }
  }
})
</script>

<style>
div {
  color: blue;
}
</style>
