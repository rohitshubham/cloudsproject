<template>
  <div class="home">
  <div class="md-layout">
      <div class="md-layout-item" ><h1>{{capitalizeFirstLetter(countryName)}}</h1></div>
    </div>
    <home-charts v-if="country.length > 0" :country="country" ></home-charts>
  <div class="md-layout">
    <div class="md-layout-item md-elevation-2 padding-class">
      <div>Data Source: <a href="https://covid19api.com">Covid-19 API / Johns Hopkins CSSE</a> | Developed by: Rohit Raj</div>
    </div>
  </div>
  </div>
</template>
<style scoped>
span {
  width: 100%;
  height: 100%;
  padding: 8px;
  display: block;
}
.padding-class{
    margin: 1%;
}

.header img {
  width: 50px;
  height: 50px;
  float: left;
  margin-right: 10px;
}

.header h1 {
  position: relative;
  width: max-content;
  float: left;
}

.header{
  margin: auto;
  width: 30%;
}
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Route } from 'vue-router'
import HomeCharts from '@/components/HomeCharts.vue'

interface WithRoute {
  $route: Route;
}

@Component({
  components: {
    HomeCharts
  }
})
export default class Country extends Vue implements WithRoute {
    private countryName = ''
    private country = ''

    private initApp (): void {
      this.country = this.$route.params.country
      this.countryName = this.country
    }

    private capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    mounted () {
      setTimeout(() => this.initApp(), 500)
    }
}
</script>
