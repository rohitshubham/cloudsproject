<template>
  <div>
    <home-charts v-if="country.length > 0" :country="country"></home-charts>
  <div class="md-layout">
    <div class="md-layout-item md-elevation-2 padding-class">
      <div>Data Source: <a href="https://covid19api.com">Covid-19 API / Johns Hopkins CSSE</a> | Developed by: Rohit Raj</div>
    </div>
  </div>
  </div>

</template>
<style scoped>

</style>
<script lang='ts'>
import Navigation from '@/components/Navigation.vue'
import HomeCharts from '@/components/HomeCharts.vue'
import { Component, Vue } from 'vue-property-decorator'

declare let firebaseObj: any | undefined

@Component({
  components: {
    Navigation,
    HomeCharts
  }
})
export default class HomePage extends Vue {
  private country = ''
  private initApp (): void {
    this.country = 'summary'
  }

  mounted () {
    setTimeout(() => this.initApp(), 100)
  }
}
</script>
