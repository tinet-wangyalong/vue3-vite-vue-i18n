<template>
  <h1>{{ msg }}</h1>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script setup>
const props = defineProps({
  msg: {
    type: String,
    default: '你好呀'
  }
})

const { query } = useRoute();
console.log(query)
</script>
