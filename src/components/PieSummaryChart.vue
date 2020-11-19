<template>
        <div class='summary-table'>
          <md-table>
           <md-table-toolbar>
                    <h3 class="md-title">{{getTableHeader()}}</h3>
            </md-table-toolbar>
          </md-table>
            <md-progress-spinner v-if="summarySpinner" md-mode="indeterminate"></md-progress-spinner>
            <pie-chart v-if="!summarySpinner" :chartData="chartData" :options="options"></pie-chart>
        </div>
</template>

<style scoped>
.padding-class{
    margin: 1%;
}
</style>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import PieChart from '@/components/ChartVue/PieChart.vue'
import axios from 'axios'
import 'firebase/firestore'
import { Dictionary } from 'vue-router/types/router'

declare let firebaseObj: any | undefined

@Component({
  components: { PieChart }
})
export default class PieSummaryChart extends Vue {
  @Prop() readonly country
    private renderChart!: (chartData: any, options?: any) => void;
    private summarySpinner = true

    private chartData = {
      labels: ['Active Cases', 'Dead Cases', 'Recovered Cases'],
      datasets: [{}]
    }

    private options = {
      responsive: true,
      maintainAspectRatio: false
    }

    private getTableHeader (): string {
      if (this.country === 'summary') {
        return 'Coronavirus Cases Distribution Worldwide'
      }

      return `Coronavirus Case Distribution in ${this.country}`
    }

    private getFirebaseData (response): Dictionary<any> {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      return {
        name: this.country,
        time: date.toISOString(),
        response: JSON.stringify(response)
      }
    }

    public database = firebaseObj.firestore()

    private checkRequiresUpdate (firebaseData) {
      const dateSaved = new Date(firebaseData.time)
      const dateToday = new Date()
      dateToday.setHours(0, 0, 0, 0)

      return dateSaved < dateToday
    }

    private checkIfDocExists () {
      const cityRef = this.database.collection('countries').doc(this.country)
      cityRef.get().then((data) => {
        /* eslint-disable no-debugger */
        if (data.exists) {
          const firebaseData = data.data()
          if (this.checkRequiresUpdate(firebaseData)) {
            axios.get('https://api.covid19api.com/summary')
              .then(response => {
                cityRef.set(this.getFirebaseData(response))
                console.log('Updated data in firestore')
                this.updateChart(response)
              })
          } else {
            console.log('Pie Chart Fetched from firestore')
            this.updateChart(JSON.parse(firebaseData.response))
          }
        } else {
          axios.get('https://api.covid19api.com/summary')
            .then(response => {
              cityRef.set(this.getFirebaseData(response))
              this.updateChart(response)
            })
        }
      })
    }

    public getSummary (): void {
      setTimeout(() => {
        if (this.country === 'summary') {
          axios
            .get('https://api.covid19api.com/summary')
            .then(response => (this.updateChart(response)))
        } else {
          this.checkIfDocExists()
        }
      }, 100)
    }

    private getData (response) {
      if (this.country === 'summary') {
        return response.data.Global
      } else {
        for (const data of response.data.Countries) {
          if (data.Slug === this.country) {
            return data
          }
        }
      }
    }

    private updateChartData (globalData): void {
      const totalDeaths = globalData.TotalDeaths
      const totalRecovered = globalData.TotalRecovered
      const activeCases = globalData.TotalConfirmed - (totalDeaths + totalRecovered)
      this.summarySpinner = false

      this.chartData.datasets = [{
        data: [activeCases, totalDeaths, totalRecovered],
        backgroundColor: ['#f4ff81', '#ffa4a2', '#80d8ff']
      }]
    }

    private updateChart (response): void {
      const globalData = this.getData(response)
      this.updateChartData(globalData)
    }

    mounted () {
      this.getSummary()
    }
}
</script>
