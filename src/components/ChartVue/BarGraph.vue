<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Bar } from 'vue-chartjs'

@Component({
  extends: Bar
})
export default class BarGraph extends Vue {
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
