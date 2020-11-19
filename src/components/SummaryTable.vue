<template>
        <div class='summary-table'>
            <md-table>
            <md-table-toolbar>
                <h3 class="md-title">{{getTableHeader()}}</h3>
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import axios from 'axios'
import 'firebase/firestore'
import { Dictionary } from 'vue-router/types/router'

declare let firebaseObj: any | undefined

@Component
export default class SummaryTable extends Vue {
    @Prop() readonly country
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
                this.updateTable(response)
              })
          } else {
            console.log('Summary Table Fetched from firestore')
            this.updateTable(JSON.parse(firebaseData.response))
          }
        } else {
          axios.get('https://api.covid19api.com/summary')
            .then(response => {
              cityRef.set(this.getFirebaseData(response))
              this.updateTable(response)
            })
        }
      })
    }

    public getSummary (): void {
      setTimeout(() => {
        if (this.country === 'summary') {
          axios
            .get('https://api.covid19api.com/summary')
            .then(response => (this.updateTable(response)))
        } else {
          this.checkIfDocExists()
        }
      }, 100)
    }

    private getTableHeader (): string {
      if (this.country === 'summary') {
        return 'Coronavirus Summary Worldwide'
      }

      return `Coronavirus Summary in ${this.country}`
    }

    private updateSummaryTable (globalData): void {
      this.totalCases = globalData.TotalConfirmed
      this.newCases = globalData.NewConfirmed
      this.newDeaths = globalData.NewDeaths
      this.totalDeaths = globalData.TotalDeaths
      this.newRecovered = globalData.NewRecovered
      this.totalRecovered = globalData.TotalRecovered

      this.activeCases = this.totalCases - (this.totalDeaths + this.totalRecovered)
      this.mortalityRate = (this.totalDeaths / (this.totalCases - this.activeCases)) * 100
      this.recoveryRate = (this.totalRecovered / (this.totalCases - this.activeCases)) * 100
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

    private updateTable (response): void {
      const globalData = this.getData(response)
      this.updateSummaryTable(globalData)
      this.summarySpinner = false
    }

    mounted () {
      this.getSummary()
    }
}
</script>
