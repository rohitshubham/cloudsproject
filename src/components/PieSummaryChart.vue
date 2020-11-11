<template>
        <div class='summary-table'>
          <md-table>
           <md-table-toolbar>
                    <h3 class="md-title">Coronavirus Cases Distribution Worldwide</h3>
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
import { Component, Vue } from 'vue-property-decorator'
import PieChart from '@/components/ChartVue/PieChart.vue'
import axios from 'axios'

@Component({
  components: { PieChart }
})
export default class PieSummaryChart extends Vue {
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

    public getSummary (): void {
      setTimeout(() => {
        axios
          .get('https://api.covid19api.com/summary')
          .then(response => (this.updateChart(response)))
      }, 1000)
    }

    private updateChart (response): void {
      const globalData = response.data.Global

      const totalDeaths = globalData.TotalDeaths
      const totalRecovered = globalData.TotalRecovered
      const activeCases = globalData.TotalConfirmed - (totalDeaths + totalRecovered)
      this.summarySpinner = false

      this.chartData.datasets = [{
        data: [activeCases, totalDeaths, totalRecovered],
        backgroundColor: ['#f4ff81', '#ffa4a2', '#80d8ff']
      }]
    }

    mounted () {
      this.getSummary()
    }
}
</script>
