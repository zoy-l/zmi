<template>
  <div @click="hello" :class="$style.div">
    {{ msg }}
  </div>
</template>

<script >
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  data() {
    return {
      msg: 'hello vue 3'
    }
  },
  methods: {
    hello() {
      console.log(this.msg)
    }
  }
})
</script>

<style module lang="less">
.div {
  color: blue;
}
</style>
