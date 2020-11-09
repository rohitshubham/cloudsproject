<template>
  <div>
    <md-toolbar class="md-primary">
      <h3 class="md-title">Corona Virus Information</h3>
    </md-toolbar>
    <navigation></navigation>
  </div>
</template>

<script lang='ts'>
import Navigation from '@/components/Navigation.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    Navigation
  }
})
export default class HomePage extends Vue { }
</script>
