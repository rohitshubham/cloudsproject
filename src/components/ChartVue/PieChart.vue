<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Pie } from 'vue-chartjs'

@Component({
  extends: Pie
})
export default class PieChart extends Vue {
    @Prop() readonly chartData
    @Prop() readonly options

    private renderChart!: (chartData: any, options?: any) => void;

    public generatePie (): void {
      this.renderChart(this.chartData, this.options)
    }

    mounted () {
      this.generatePie()
    }
}
</script>
