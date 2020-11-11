<template>
        <div class='summary-table'>
            <md-table>
            <md-table-toolbar>
                <h3 class="md-title">Coronavirus Summary Worldwide</h3>
            </md-table-toolbar>
            </md-table>
            <md-progress-spinner v-if="summarySpinner" md-mode="indeterminate"></md-progress-spinner>
            <md-table v-if="!summarySpinner">
                <md-table-row class="total-cases">
                    <md-table-cell>Total Cases
                    </md-table-cell>
                    <md-table-cell>{{totalCases}}
                    </md-table-cell>
                </md-table-row>
                <md-table-row class="total-cases">
                    <md-table-cell>New Cases
                    </md-table-cell>
                    <md-table-cell>{{newCases}}
                    </md-table-cell>
                </md-table-row>
                <md-table-row class="total-cases">
                    <md-table-cell> Active Cases
                    </md-table-cell>
                    <md-table-cell>{{activeCases}}
                    </md-table-cell>
                </md-table-row>
                <md-table-row class="death-cases">
                    <md-table-cell>Total Recovered
                    </md-table-cell>
                    <md-table-cell>{{totalRecovered}}
                    </md-table-cell>
                </md-table-row>
                <md-table-row class="death-cases">
                    <md-table-cell>New Recovered
                    </md-table-cell>
                    <md-table-cell>{{newRecovered}}
                    </md-table-cell>
                </md-table-row>
                <md-table-row class="death-cases">
                    <md-table-cell>Recovery Rate
                    </md-table-cell>
                    <md-table-cell>{{recoveryRate.toFixed(2)}}%
                    </md-table-cell>
                </md-table-row>
                <md-table-row class="recovered-cases">
                    <md-table-cell>Total Deaths
                    </md-table-cell>
                    <md-table-cell>{{totalDeaths}}
                    </md-table-cell>
                </md-table-row>
                <md-table-row class="recovered-cases">
                    <md-table-cell>New Deaths
                    </md-table-cell>
                    <md-table-cell>{{newDeaths}}
                    </md-table-cell>
                </md-table-row>
                <md-table-row class="recovered-cases">
                    <md-table-cell>Mortality Rate
                    </md-table-cell>
                    <md-table-cell>{{mortalityRate.toFixed(2)}}%
                    </md-table-cell>
                </md-table-row>
            </md-table>
        </div>
</template>
<style scoped>
.padding-class{
    margin: 1%;
}
.total-cases{
    background: rgba(244, 255, 129, 0.7)
}
.recovered-cases{
    background: rgba(255, 164, 162, 0.7);
}
.death-cases{
    background: rgba(128, 216, 255, 0.7)
}
.summary-table{
    position: center;
}
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class SummaryTable extends Vue {
    table = ''
    private summarySpinner = true

    // Table specific variables
    private totalCases = 0
    private newCases = 0
    private activeCases = 0

    private totalRecovered = 0
    private newRecovered = 0
    private recoveryRate = 0

    private totalDeaths = 0
    private newDeaths = 0
    private mortalityRate = 0

    public getSummary (): void {
      setTimeout(() => {
        axios
          .get('https://api.covid19api.com/summary')
          .then(response => (this.updateTable(response)))
      }, 1000)
    }

    private updateTable (response): void {
      const globalData = response.data.Global
      this.totalCases = globalData.TotalConfirmed
      this.newCases = globalData.NewConfirmed
      this.newDeaths = globalData.NewDeaths
      this.totalDeaths = globalData.TotalDeaths
      this.newRecovered = globalData.NewRecovered
      this.totalRecovered = globalData.TotalRecovered

      this.activeCases = this.totalCases - (this.totalDeaths + this.totalRecovered)
      this.mortalityRate = (this.totalDeaths / (this.totalCases - this.activeCases)) * 100
      this.recoveryRate = (this.totalRecovered / (this.totalCases - this.activeCases)) * 100

      this.summarySpinner = false
    }

    mounted () {
      this.getSummary()
    }
}
</script>
