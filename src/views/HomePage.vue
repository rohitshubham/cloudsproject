<template>
  <div>
 <div class="md-layout">
    <div class="md-layout-item md-elevation-2" style="margin: 1%;">
      <a href="/">
      <div class="header">
        <img class= "coronavirus-image" :src="imageUrl" alt="Coronavirus">
        <h1>Covid-19 Information Center</h1>
        </div>
      </a>
    </div>
  </div>
    <home-charts v-if="country.length > 0" :country="country"></home-charts>
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
  width:30%;
}
</style>
<script lang='ts'>
import Navigation from '@/components/Navigation.vue'
import HomeCharts from '@/components/HomeCharts.vue'
import { Component, Vue } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/storage'

declare let firebaseObj: any | undefined

@Component({
  components: {
    Navigation,
    HomeCharts
  }
})
export default class HomePage extends Vue {
  private imageUrl= ''
  private country = ''
  private initApp (): void {
    this.country = 'summary'
    const storage = firebaseObj.storage()
    const gsReference = storage.refFromURL('gs://covid19-fa2c0.appspot.com/23312-min(1).jpg')

    gsReference.getDownloadURL().then((url) => {
      this.imageUrl = url
    })
  }

  mounted () {
    setTimeout(() =>
      this.initApp(),
    500
    )
  }
}
</script>
