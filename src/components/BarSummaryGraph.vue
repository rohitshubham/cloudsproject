<template>
        <div class='summary-table'>
            <md-table>
           <md-table-toolbar>
                    <h3 class="md-title">{{getTableHeader()}}</h3>
            </md-table-toolbar>
            </md-table>
            <md-progress-spinner v-if="summarySpinner" md-mode="indeterminate"></md-progress-spinner>
            <bar-graph v-if="!summarySpinner" :chartData="chartData" :options="options"></bar-graph>
        </div>
</template>

<style scoped>
.padding-class{
    margin: 1%;
}
</style>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import BarGraph from '@/components/ChartVue/BarGraph.vue'
import axios from 'axios'

export class CountryDataFetchService {
  private confirmedCountryData
  private deathCountryData
  private recoveredCountryData
  private startDate
  private endDate
  private countryData

  constructor (country: string) {
    this.countryData = country
  }

  public getDeathData () {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://api.covid19api.com/country/${this.countryData}/status/deaths?from=${this.endDate}T00:00:00Z&to=${this.startDate}T00:00:00Z`)
        .then(response => { this.deathCountryData = response.data; resolve() })
    })
  }

  public getRecoveredData () {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://api.covid19api.com/country/${this.countryData}/status/recovered?from=${this.endDate}T00:00:00Z&to=${this.startDate}T00:00:00Z`)
        .then(response => { this.recoveredCountryData = response.data; resolve() })
    })
  }

  public getCountryData () {
    return new Promise((resolve, reject) => {
      const todayDate = new Date()
      const pastDate = todayDate.getDate() - 8
      this.startDate = todayDate.toISOString().slice(0, 10)

      todayDate.setDate(pastDate)
      this.endDate = todayDate.toISOString().slice(0, 10)
      this.getConfirmedData()
        .then(() => this.getRecoveredData())
        .then(() => this.getDeathData())
        .then(() => this.updateCountryData())
        .then((response) => { resolve(response) })
    })
  }

  private getConfirmedData () {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://api.covid19api.com/country/${this.countryData}/status/confirmed?from=${this.endDate}T00:00:00Z&to=${this.startDate}T00:00:00Z`)
        .then(response => { this.confirmedCountryData = response.data; resolve() })
    })
  }

  private getData (dataArray) {
    const result: any = []
    let i
    for (i = 1; i < 8; i++) {
      result.push(Math.abs(parseInt(dataArray[i].Cases) - parseInt(dataArray[i - 1].Cases)))
    }

    return result
  }

  private updateCountryData () {
    return new Promise((resolve, reject) => {
      resolve([this.getData(this.confirmedCountryData), this.getData(this.recoveredCountryData), this.getData(this.deathCountryData)])
    })
  }
}

@Component({
  components: { BarGraph }
})
export default class BarSummaryGraph extends Vue {
    @Prop() readonly country
    private summarySpinner = true
    private startDate
    private endDate
    private chartData = {
      labels: ['Active Cases', 'Dead Cases', 'Recovered Cases'],
      datasets: [{}]
    }

    private options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false
          }
        }]
      }
    }

    public getSummary (): void {
      const todayDate = new Date()
      const pastDate = todayDate.getDate() - 7
      const startDate = todayDate.toISOString().slice(0, 10)

      todayDate.setDate(pastDate)
      const endDate = todayDate.toISOString().slice(0, 10)

      setTimeout(() => {
        axios
          .get(`https://api.covid19api.com/world?from=${endDate}T00:00:00Z&to=${startDate}T00:00:00Z`)
          .then(response => (this.getChartData(response)))
      }, 1000)
    }

    private generateLabels (): string[] {
      const labels: string[] = []
      for (let i = 0; i < 7; i++) {
        const todayDate = new Date()
        const pastDate = todayDate.getDate() - i
        todayDate.setDate(pastDate)
        labels.push(todayDate.toISOString().slice(0, 10))
      }
      return labels
    }

    private getChartData (response) {
      const globalData = response.data

      const newConfirmedData: string[] = []
      for (const data of globalData) {
        const NewConfirmed = data.NewConfirmed
        newConfirmedData.push(NewConfirmed)
      }

      const newDeathData: string[] = []
      for (const data of globalData) {
        const NewDeaths = data.NewDeaths
        newDeathData.push(NewDeaths)
      }

      const newRecoveredData: string[] = []
      for (const data of globalData) {
        const NewRecovered = data.NewRecovered
        newRecoveredData.push(NewRecovered)
      }
      this.updateChart(newConfirmedData, newDeathData, newRecoveredData)
    }

    private getTableHeader (): string {
      if (this.country === 'summary') {
        return 'Daily Coronavirus Cases Worldwide'
      }

      return `Daily Coronavirus Cases in ${this.country}`
    }

    private updateChart (newConfirmedData, newDeathData, newRecoveredData): void {
      this.chartData.labels = this.generateLabels()
      this.summarySpinner = false

      this.chartData.datasets = [{
        data: newConfirmedData,
        label: ['New Cases'],
        backgroundColor: ['#f4ff81', '#f4ff81', '#f4ff81', '#f4ff81', '#f4ff81', '#f4ff81', '#f4ff81']
      }]

      this.chartData.datasets.push({
        data: newDeathData,
        label: ['New Deaths'],
        backgroundColor: ['#ffa4a2', '#ffa4a2', '#ffa4a2', '#ffa4a2', '#ffa4a2', '#ffa4a2', '#ffa4a2']
      })

      this.chartData.datasets.push({
        data: newRecoveredData,
        label: ['New Recoveries'],
        backgroundColor: ['#80d8ff', '#80d8ff', '#80d8ff', '#80d8ff', '#80d8ff', '#80d8ff', '#80d8ff']
      })
    }

    mounted () {
      setTimeout(() => {
        if (this.country === 'summary') {
          this.getSummary()
        } else {
          const cc = new CountryDataFetchService(this.country)
          cc.getCountryData().then((response: any) => {
            this.updateChart(response[0], response[2], response[1])
          })
        }
      }, 1000)
    }
}
</script>
