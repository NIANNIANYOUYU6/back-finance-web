
<template>
  <div class="title">
    <div class="title_icon">
      <img class="icon" :src="'./img/icon/' + title.tokenA + '.png'" />
      <img class="icon" :src="'./img/icon/' + title.tokenB + '.png'" />
      <span class="name" style="font-size: 16px"> {{ title.source }}</span>
      <span class="name" style="font-size: 16px"> {{ title.tokenA }}/{{ title.tokenB }} </span>
    </div>
    <div class="title_name">{{ title.name }}</div>
  </div>
</template>
 
<script>
export default {
  props: {
    title: Object,
  },
};
</script>