
<template>
  <div class="title_name">{{ title.name }}</div>
  <div class="title_icon">
    <img class="icon" :src="'./assets/' + title.tokenA + '.png'" />
    <img class="icon" :src="'./assets/' + title.tokenB + '.png'" />
    <span class="name" style="font-size: 16px"> {{ title.swapperName }}</span>
    <span class="name" style="font-size: 16px"> {{ title.tokenA }}/{{ title.tokenB }} </span>
  </div>
</template>
 
<script>
export default {
  props: {
    title: Object,
  },
};
</script>