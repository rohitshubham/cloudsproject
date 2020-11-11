<template>
   <div>
       <div class="md-layout md-gutter-large">
            <div class="md-layout-item md-elevation-2 padding-class">
                <summary-table></summary-table>
            </div>
            <div class="md-layout-item md-elevation-2 padding-class">
            <pie-summary-chart></pie-summary-chart>
            </div>
        </div>
        <div class="md-layout md-gutter-large">
            <div class="md-layout-item md-elevation-2 padding-class">
                <bar-summary-graph></bar-summary-graph>
            </div>
            <div class="md-layout-item md-elevation-2 padding-class">
                <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
            </div>
        </div>
        <div class="md-layout md-gutter-large">
            <div class="md-layout-item md-small md-elevation-2 padding-class">
                <div class='summary-table'>
                    <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
                </div>
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
import { Component, Vue } from 'vue-property-decorator'
import SummaryTable from '@/components/SummaryTable.vue'
import PieSummaryChart from '@/components/PieSummaryChart.vue'
import BarSummaryGraph from '@/components/BarSummaryGraph.vue'

@Component({
  components: {
    SummaryTable,
    PieSummaryChart,
    BarSummaryGraph
  }
})
export default class HomeCharts extends Vue {
}
</script>
