<template>
        <div class='summary-table'>
            <md-table>
           <md-table-toolbar>
                    <h3 class="md-title">Total Corona Virus Cases Worldwide</h3>
            </md-table-toolbar>
            </md-table>
            <md-progress-spinner v-if="summarySpinner" md-mode="indeterminate"></md-progress-spinner>
            <line-graph v-if="!summarySpinner" :chartData="chartData" :options="options"></line-graph>
        </div>
</template>

<style scoped>
.padding-class{
    margin: 1%;
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import LineGraph from '@/components/ChartVue/LineGraph.vue'
import axios from 'axios'
import 'firebase/firestore'
import { Dictionary } from 'vue-router/types/router'

declare let firebaseObj: any | undefined

@Component({
  components: { LineGraph }
})
export default class LineSummaryGraph extends Vue {
    @Prop() readonly country
    private summarySpinner = true
    private isSummaryCall = true
    private chartData = {
      labels: ['Active Cases', 'Dead Cases', 'Recovered Cases'],
      datasets: [{}]
    }

    private url = ''
    private options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          gridLines: {
            drawOnChartArea: false
          }
        }],
        xAxes: [{
          ticks: {
            autoskip: true,
            autoSkipPadding: 10
          },
          gridLines: {
            drawOnChartArea: false
          },
          type: 'time',
          distribution: 'series',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM D'

            },
            tooltipFormat: 'MMM D'
          }
        }
        ]
      }
    }

    public database = firebaseObj.firestore()

    private checkRequiresUpdate (firebaseData) {
      const dateSaved = new Date(firebaseData.time)
      const dateToday = new Date()
      dateToday.setHours(0, 0, 0, 0)

      return dateSaved < dateToday
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

    private checkIfDocExists () {
      const cityRef = this.database.collection('countriesLine').doc(this.country)
      cityRef.get().then(data => {
        if (data.exists) {
          const firebaseData = data.data()
          if (this.checkRequiresUpdate(firebaseData)) {
            axios
              .get(this.url)
              .then(response => {
                cityRef.set(this.getFirebaseData(response))
                console.log('Updated line graph data in firestore')
                this.updateChart(response)
              })
          } else {
            console.log('fetched line graph from firestore')
            this.updateChart(JSON.parse(firebaseData.response))
          }
        } else {
          axios
            .get(this.url)
            .then(response => {
              cityRef.set(this.getFirebaseData(response))
              console.log('Updated line graph data in firestore')
              this.updateChart(response)
            })
        }
      })
    }

    public getSummary (): void {
      const todayDate = new Date()
      const startDate = todayDate.toISOString().slice(0, 10)

      const endDate = '2020-04-13'

      setTimeout(() => {
        if (this.country === 'summary') {
          this.url = `https://api.covid19api.com/world?from=${endDate}T00:00:00Z&to=${startDate}T00:00:00Z`
          axios
            .get(this.url)
            .then(response => this.updateChart(response))
        } else {
          this.isSummaryCall = false
          this.url = `https://api.covid19api.com/country/${this.country}?from=${endDate}T00:00:00Z&to=${startDate}T00:00:00Z`
          this.checkIfDocExists()
        }
      }, 500)
    }

    private generateLabels (labelLength: number): string[] {
      const labels: string[] = []
      for (let i = 0; i < labelLength; i++) {
        const todayDate = new Date()
        const pastDate = todayDate.getDate() - i
        todayDate.setDate(pastDate)
        labels.push(todayDate.toISOString().slice(0, 10))
      }
      return labels
    }

    private updateChart (response): void {
      const globalData = response.data
      this.chartData.labels = this.generateLabels(globalData.length)

      this.summarySpinner = false
      if (this.isSummaryCall) { globalData.sort((b, a) => (parseInt(a.TotalConfirmed) > parseInt(b.TotalConfirmed)) ? 1 : ((parseInt(b.TotalConfirmed) > parseInt(a.TotalConfirmed)) ? -1 : 0)) }

      const totalConfirmedData: string[] = []
      let totalConfirmed = 0
      for (const data of globalData) {
        totalConfirmed = this.isSummaryCall ? parseInt(data.TotalConfirmed) : parseInt(data.Confirmed)
        this.isSummaryCall ? totalConfirmedData.push(totalConfirmed.toString()) : totalConfirmedData.unshift(totalConfirmed.toString())
      }

      this.chartData.datasets = [{
        data: totalConfirmedData,
        fill: true,
        backgroundColor: 'rgba(244, 255, 129, 0.7)',
        label: ['Total Cases']
      }]

      const totalRecoveredData: string[] = []
      let totalRecoveries = ''
      for (const data of globalData) {
        totalRecoveries = this.isSummaryCall ? data.TotalRecovered : data.Recovered
        this.isSummaryCall ? totalRecoveredData.push(totalRecoveries) : totalRecoveredData.unshift(totalRecoveries)
      }

      this.chartData.datasets.unshift({
        data: totalRecoveredData,
        fill: true,
        backgroundColor: 'rgba(128, 216, 255, 0.7)',
        label: ['Total Recoveries']
      })

      const totalDeathData: string[] = []
      let totalDeaths = ''
      for (const data of globalData) {
        totalDeaths = this.isSummaryCall ? data.TotalDeaths : data.Deaths
        this.isSummaryCall ? totalDeathData.push(totalDeaths) : totalDeathData.unshift(totalDeaths)
      }

      this.chartData.datasets.unshift({
        data: totalDeathData,
        fill: true,
        backgroundColor: 'rgba(255, 164, 162, 0.7)',
        label: ['Total Deaths']
      })
    }

    mounted () {
      this.getSummary()
    }
}
</script>
