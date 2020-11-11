<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Line } from 'vue-chartjs'

@Component({
  extends: Line
})
export default class LineGraph extends Vue {
    @Prop() readonly chartData
    @Prop() readonly options

    private renderChart!: (chartData: any, options?: any) => void;

    public generateBar (): void {
      this.renderChart(this.chartData, this.options)
    }

    mounted () {
      this.generateBar()
    }
}
</script>
