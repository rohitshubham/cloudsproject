<template>
  <div>
 <div class="md-layout">
    <div class="md-layout-item">
      <span>Covid-19 information center</span>
    </div>
  </div>
    <home-charts></home-charts>
  </div>
</template>
<style scoped>
span {
  width: 100%;
  height: 100%;
  padding: 8px;
  display: block;
}
</style>
<script lang='ts'>
import Navigation from '@/components/Navigation.vue'
import HomeCharts from '@/components/HomeCharts.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    Navigation,
    HomeCharts
  }
})
export default class HomePage extends Vue {
}
</script>
