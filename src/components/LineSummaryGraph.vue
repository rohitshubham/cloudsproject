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
import { Component, Vue } from 'vue-property-decorator'
import LineGraph from '@/components/ChartVue/LineGraph.vue'
import axios from 'axios'

@Component({
  components: { LineGraph }
})
export default class LineSummaryGraph extends Vue {
    private summarySpinner = true

    private chartData = {
      labels: ['Active Cases', 'Dead Cases', 'Recovered Cases'],
      datasets: [{}]
    }

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

    public getSummary (): void {
      const todayDate = new Date()
      const startDate = todayDate.toISOString().slice(0, 10)

      const endDate = '2020-04-13'

      setTimeout(() => {
        axios
          .get(`https://api.covid19api.com/world?from=${endDate}T00:00:00Z&to=${startDate}T00:00:00Z`)
          .then(response => (this.updateChart(response)))
      }, 1000)
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

      // globalData.sort((b, a) => (parseInt(a.TotalConfirmed) > parseInt(b.TotalConfirmed)) ? 1 : ((parseInt(b.TotalConfirmed) > parseInt(a.TotalConfirmed)) ? -1 : 0))

      const totalConfirmedData: string[] = []
      let totalConfirmed = 0
      for (const data of globalData) {
        totalConfirmed = parseInt(data.NewConfirmed) + totalConfirmed
        totalConfirmedData.unshift(totalConfirmed.toString())
      }

      this.chartData.datasets = [{
        data: totalConfirmedData,
        fill: true,
        backgroundColor: 'rgba(244, 255, 129, 0.7)',
        label: ['Total Cases']
      }]

      const totalRecoveredData: string[] = []
      let totalRecoveries = 0
      for (const data of globalData) {
        totalRecoveries = parseInt(data.NewRecovered) + totalRecoveries
        totalRecoveredData.unshift(totalRecoveries.toString())
      }

      this.chartData.datasets.unshift({
        data: totalRecoveredData,
        fill: true,
        backgroundColor: 'rgba(128, 216, 255, 0.7)',
        label: ['Total Recoveries']
      })

      const totalDeathData: string[] = []
      let totalDeaths = 0
      for (const data of globalData) {
        totalDeaths = parseInt(data.NewDeaths) + totalDeaths
        totalDeathData.unshift(totalDeaths.toString())
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
