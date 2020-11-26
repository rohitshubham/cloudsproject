<template>
    <div class='news-table'>
        <md-table>
            <md-table-toolbar>
                <h3 class="md-title">{{getTableHeader()}}</h3>
            </md-table-toolbar>
        </md-table>
        <md-progress-spinner v-if="summarySpinner" md-mode="indeterminate"></md-progress-spinner>
        <md-table md-card v-model="news" v-if="!summarySpinner">
            <md-table-row slot="md-table-row" slot-scope = "{ item }">
                <md-table-cell class="centered" md-label="News Posted Time" md-sort-by="created">{{ item.created }}</md-table-cell>
                <md-table-cell class="centered" md-label="Posted By">{{ item.userName }}</md-table-cell>
                <md-table-cell class="centered" md-label="User Email">{{ item.email }}</md-table-cell>
                <md-table-cell class="centered" md-label="News">{{ item.news }}</md-table-cell>
            </md-table-row>
            <md-table-empty-state
                md-label="No news found!" >
            </md-table-empty-state>

        </md-table>
    </div>
</template>
<style scoped>
.centered{
    text-align: initial;
}
</style>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import 'firebase/firestore'

declare let firebaseObj: any | undefined
@Component
export default class NewsSummaryTable extends Vue {
    @Prop() readonly country
    private summarySpinner = true
    private news: any[] = []

    private getFormattedTime (timeString: string): string {
      const d = new Date(timeString)
      const datestring = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
    d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)

      return datestring
    }

    private populateTable (resp) {
      if (resp.length === 0) {
        console.log('no news found')
      } else {
        resp.forEach(element => {
          const data = element.data()
          this.news.unshift({
            created: this.getFormattedTime(data.created),
            userName: data.userName,
            email: data.email,
            news: data.news
          })
        })
      }
      this.summarySpinner = false
    }

    private getNewsSummary () {
      const country = this.country === 'summary' ? 'worldwide' : this.country
      console.log(country)
      firebaseObj
        .firestore()
        .collection('news')
        .where('slug', '==', country)
        .get()
        .then(resp => {
          this.populateTable(resp)
        })
    }

    private capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    private getTableHeader (): string {
      if (this.country === 'summary') {
        return 'News Summary Worldwide'
      }

      return `News Summary for ${this.capitalizeFirstLetter(this.country)}`
    }

    mounted () {
      setTimeout(() => this.getNewsSummary(), 500)
    }
}
</script>
