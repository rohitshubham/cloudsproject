<template>
        <div class='summary-table'>
            <md-table>
            <md-table-toolbar>
                <h3 class="md-title">Coronavirus Summary Worldwide</h3>
            </md-table-toolbar>
            </md-table>
            <md-progress-spinner v-if="summarySpinner" md-mode="indeterminate"></md-progress-spinner>
            <md-table md-sort="name"  md-card md-sort-order="asc" v-model="countries" v-if="!summarySpinner">
                <md-table-row slot="md-table-row" slot-scope = "{ item }">
                  <md-table-cell class="country" md-label="Country Name" md-sort-by="name"><a :href='"/country/" + item.slug'>{{ item.name }}</a></md-table-cell>
                  <md-table-cell class="total-cases" md-label="New Cases" md-sort-by="newCases">{{ item.newCases }}</md-table-cell>
                  <md-table-cell class="total-cases" md-label="Total Cases" md-sort-by="totalCases">{{ item.totalCases }}</md-table-cell>
                  <md-table-cell class="recovered-cases" md-label="New Recoveries" md-sort-by="newRecoveries">{{ item.newRecoveries }}</md-table-cell>
                  <md-table-cell class="recovered-cases" md-label="Total Recoveries" md-sort-by="totalRecoveries">{{ item.totalRecoveries }}</md-table-cell>
                  <md-table-cell class="death-cases" md-label="New Deaths" md-sort-by="newDeaths">{{ item.newDeaths }}</md-table-cell>
                  <md-table-cell class="death-cases" md-label="Total Deaths" md-sort-by="totalDeaths">{{ item.totalDeaths }}</md-table-cell>
                </md-table-row>
            </md-table>
        </div>
</template>
<style scoped>
.padding-class{
    margin: 1%;
}
.country{
    background: #e0f2f1
}
td.total-cases{
    background-color: rgba(244, 255, 129, 0.7)
}
td.death-cases{
    background: rgba(255, 164, 162, 0.7);
}
td.recovered-cases{
    background: rgba(128, 216, 255, 0.7)
}
.summary-table{
    position: center;
    height: 800px;
    overflow: auto;
}

.md-table-row:hover {
  background-color: rgba(255, 109, 0, 0.1)
}

.country{
  text-decoration: underline;
}
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class CountrySummaryTable extends Vue {
    table = ''
    private summarySpinner = true

    private countries: any[] = []

    public getSummary (): void {
      setTimeout(() => {
        axios
          .get('https://api.covid19api.com/summary')
          .then(response => (this.updateTable(response)))
      }, 1000)
    }

    private updateTable (response): void {
      const countriesData = response.data.Countries

      for (const data of countriesData) {
        this.countries.push({
          name: data.Country,
          newCases: data.NewConfirmed,
          totalCases: data.TotalConfirmed,
          newRecoveries: data.NewRecovered,
          totalRecoveries: data.TotalRecovered,
          newDeaths: data.NewDeaths,
          totalDeaths: data.TotalDeaths,
          slug: data.Slug
        })
      }
      this.summarySpinner = false
    }

    mounted () {
      this.getSummary()
    }
}
</script>
