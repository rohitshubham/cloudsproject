<template>
        <div class='summary-table'>
            <md-table>
           <md-table-toolbar>
                    <h3 class="md-title">Daily Corona Virus Cases Worldwide</h3>
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
import { Component, Vue } from 'vue-property-decorator'
import BarGraph from '@/components/ChartVue/BarGraph.vue'
import axios from 'axios'

@Component({
  components: { BarGraph }
})
export default class BarSummaryGraph extends Vue {
    private summarySpinner = true

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
          .then(response => (this.updateChart(response)))
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

    private updateChart (response): void {
      this.chartData.labels = this.generateLabels()

      const globalData = response.data
      this.summarySpinner = false

      const newConfirmedData: string[] = []
      for (const data of globalData) {
        const NewConfirmed = data.NewConfirmed
        newConfirmedData.push(NewConfirmed)
      }

      this.chartData.datasets = [{
        data: newConfirmedData,
        label: ['New Cases'],
        backgroundColor: ['#f4ff81', '#f4ff81', '#f4ff81', '#f4ff81', '#f4ff81', '#f4ff81', '#f4ff81']
      }]

      const newDeathData: string[] = []
      for (const data of globalData) {
        const NewDeaths = data.NewDeaths
        newDeathData.push(NewDeaths)
      }

      this.chartData.datasets.push({
        data: newDeathData,
        label: ['New Deaths'],
        backgroundColor: ['#ffa4a2', '#ffa4a2', '#ffa4a2', '#ffa4a2', '#ffa4a2', '#ffa4a2', '#ffa4a2']
      })

      const newRecoveredData: string[] = []
      for (const data of globalData) {
        const NewRecovered = data.NewRecovered
        newRecoveredData.push(NewRecovered)
      }

      this.chartData.datasets.push({
        data: newRecoveredData,
        label: ['New Recoveries'],
        backgroundColor: ['#80d8ff', '#80d8ff', '#80d8ff', '#80d8ff', '#80d8ff', '#80d8ff', '#80d8ff']
      })
    }

    mounted () {
      this.getSummary()
    }
}
</script>
