<template>
  <div>
    <div class="md-layout" style="margin-left: 1%; margin-right: 1%">
      <div class="md-layout-item md-elevation-2">
        <md-button class="md-fab md-primary" @click="active = true"><md-icon>add</md-icon></md-button>
        <h1 id="add-news">Add News</h1>
      </div>
    </div>
    <md-dialog :md-active.sync="active">
      <md-dialog-title> Add News Item </md-dialog-title>
      <md-dialog-content>
        <div id="mixed-menu">
          <md-autocomplete v-model="selectedCountry" :md-options="countries" md-dense>
              <label>Country</label>
          </md-autocomplete>
          <md-field>
            <label>News</label>
            <md-textarea v-model="textarea" md-counter="300" required></md-textarea>
          </md-field>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="onCancel">Close</md-button>
        <md-button class="md-primary" @click="onConfirm">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<style scoped>
#add-news{
  display: inline-block;
  margin-top: 1.5%
}

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class News extends Vue {
  private active = false
  private value: string | null = null
  private textarea: string | null = null

  private onConfirm () {
    this.value = 'Agreed'
    this.active = false
  }

  private onCancel () {
    this.value = 'Disagreed'
    this.active = false
  }

      private selectedCountry: string | null = null
    private countries = [
      'Algeria',
      'Argentina',
      'Brazil',
      'Canada',
      'Italy',
      'Japan',
      'United Kingdom',
      'United States'
    ]
}

</script>
