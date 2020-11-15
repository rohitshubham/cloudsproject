<template>
   <div>
       <div class="md-layout md-gutter-large">
            <div class="md-layout-item md-elevation-2 padding-class">
                <summary-table :country="name"></summary-table>
            </div>
            <div class="md-layout-item md-elevation-2 padding-class">
                <pie-summary-chart :country="name"></pie-summary-chart>
            </div>
        </div>
        <div class="md-layout md-gutter-large">
            <div class="md-layout-item md-elevation-2 padding-class">
                <bar-summary-graph :country="name"></bar-summary-graph>
            </div>
            <div class="md-layout-item md-elevation-2 padding-class">
                <line-summary-graph :country="name"></line-summary-graph>
            </div>
        </div>
        <div v-if="country == 'summary'" class="md-layout md-gutter-large">
            <div class="md-layout-item md-small md-elevation-2 padding-class">
                <country-summary-table></country-summary-table>
            </div>
        </div>
    </div>
</template>
<style scoped>
.padding-class{
    margin: 1%;
}
</style>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import SummaryTable from '@/components/SummaryTable.vue'
import PieSummaryChart from '@/components/PieSummaryChart.vue'
import BarSummaryGraph from '@/components/BarSummaryGraph.vue'
import LineSummaryGraph from '@/components/LineSummaryGraph.vue'
import CountrySummaryTable from '@/components/CountrySummaryTable.vue'

@Component({
  components: {
    SummaryTable,
    PieSummaryChart,
    BarSummaryGraph,
    LineSummaryGraph,
    CountrySummaryTable
  }
})
export default class HomeCharts extends Vue {
    @Prop() readonly country
    private name=''

    mounted () {
      this.name = this.country
    }
}
</script>
