<template>
  <div class="home">
     <div class="md-layout">
    <div class="md-layout-item md-elevation-2" style="margin: 1%;">
      <div class="header">
        <img class= "coronavirus-image" :src="imageUrl" alt="Coronavirus">
        <h1 v-if="country.length > 0">{{countryName}}'s Covid-19 Information Center</h1>
        </div>
    </div>
  </div>
    <home-charts v-if="country.length > 0" :country="country" ></home-charts>
  <div class="md-layout">
    <div class="md-layout-item md-elevation-2 padding-class">
      <div>Data Source: <a href="https://covid19api.com">Covid-19 API / Johns Hopkins CSSE</a> | Developed by: Rohit Raj</div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Route } from 'vue-router'
import HomeCharts from '@/components/HomeCharts.vue'
import firebase from 'firebase/app'
import 'firebase/storage'

declare let firebaseObj: any

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
    private imageUrl = ''
    private country = ''

    mounted () {
      this.country = this.$route.params.country
      this.countryName = this.country
      const storage = firebaseObj.storage()
      const gsReference = storage.refFromURL('gs://covid19-fa2c0.appspot.com/23312-min(1).jpg')

      gsReference.getDownloadURL().then((url) => {
        this.imageUrl = url
      })
    }
}
</script>
