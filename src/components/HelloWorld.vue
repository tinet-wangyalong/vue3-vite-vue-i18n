<template>
<div style="margin-top: 100px">
  <div class="l-size">
    {{$t("login.title")}}
    </div>
    <button @click="handleLang('zh_CN')">中文</button>
    <button @click="handleLang('en_US')">英文</button>
 </div>
  <!-- <h1>{{ msg }}</h1> -->
  <!-- <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p> -->
</template>

<script setup>
  const { t, locale } = useI18n();
  const all = reactive({
    a: 111
  })
  console.log(locale)
  console.log(t('login.title'), '===')

  // 切换
  function handleLang (val) {
    console.log(23333, val, locale)
    locale.value = val;
    localStorage.setItem('language', val)
  };

const props = defineProps({
  msg: {
    type: String,
    default: '你好呀'
  }
})

// const { query } = useRoute();
// console.log(query)
</script>
<style lang="scss" scoped>
.l-size {
    font-size: $large-size;
}
</style>
