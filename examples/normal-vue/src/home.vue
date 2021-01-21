<template>
  <div @click="hello">
    {{ msg }}
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
      console.log(this)
    }
  }
})
</script>

<style module>
.div {
  color: blue;
}
</style>
