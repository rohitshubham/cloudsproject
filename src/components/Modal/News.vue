<template>
  <div>
    <div class="md-layout" style="margin-left: 1%; margin-right: 1%">
      <div class="md-layout-item md-elevation-2">
        <div style="display:inline-block">
          <md-button v-if="!isAllowedToAddNews" class="md-fab md-primary" @click="active = true" disabled><md-icon>add</md-icon></md-button>
          <md-tooltip md-direction="right">You are not allowed to add news. Contact admin!</md-tooltip>
        </div>
        <div style="display:inline-block">
          <md-button v-if="isAllowedToAddNews" class="md-fab md-primary" @click="active = true"><md-icon>add</md-icon></md-button>
          <md-tooltip md-direction="right">Add a new news!</md-tooltip>
        </div >
        <div>
          <h2 id="add-news">Add News</h2>
        </div>
      </div>
    </div>
    <md-dialog :md-active.sync="active">
      <md-dialog-title> Add News Item </md-dialog-title>
      <md-dialog-content>
        <div id="mixed-menu">
          <md-autocomplete :md-fuzzy-search="false" v-model="selectedCountryTerm" :md-options="countries" @md-selected="selectCountry"
 md-dense>
              <label>Country</label>
              <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                <md-highlight-text :md-term="term">{{ item.Country }}</md-highlight-text>
              </template>
              <template slot="md-autocomplete-empty" slot-scope="{ term }">
                No countries matching "{{ term }}" were found.
              </template>
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
    <md-dialog-alert
      :md-active.sync="displaySavedStatus"
      md-content="Your news has been saved!"
      md-confirm-text="OK" />

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import 'firebase/firestore'
import 'firebase/auth'

// eslint-disable-next-line
declare let firebaseObj: any | undefined

@Component
export default class News extends Vue {
  private active = false
  private value: string | null = null
  private textarea: string | null = null
  private displaySavedStatus = false
  private selectedCountry
  private signedUserEmail
  private signedUserName
  private selectedCountryTerm: string | null = null
  private isAllowedToAddNews = false

  // Added some default countries
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

  private selectCountry (country) {
    this.selectedCountry = country
    this.selectedCountryTerm = country.Country
  }

  private onConfirm () {
    this.value = 'Agreed'
    this.active = false
    const date = new Date()

    firebaseObj.firestore()
      .collection('news')
      .add({
        slug: this.selectedCountry.Slug,
        countryName: this.selectedCountry.Country,
        userName: this.signedUserName,
        email: this.signedUserEmail,
        news: this.textarea,
        created: date.toISOString()
      }).then((res) => {
        console.log(`saved the document with id : ${res.id}`)
        this.displaySavedStatus = true
      })
  }

  private onCancel () {
    this.value = 'Disagreed'
    this.active = false
  }

  private initNewsButton () {
    const userEmail = firebaseObj.auth().currentUser.email
    console.log(userEmail)
    firebaseObj.firestore().collection('allowedUsers').doc(userEmail).get().then(data => {
      if (data.exists) {
        console.log('User is allowed to add news')
        this.isAllowedToAddNews = true
        this.initNewsApp()
      }
    })
  }

  private initNewsApp () {
    const user = firebaseObj.auth().currentUser
    const countriesData = firebaseObj.firestore()
      .collection('countriesList')
      .doc('list')
    countriesData.get().then((data) => {
      if (!data.exists) {
      // impossible to happen unless someone deletes the data from backend
        console.log('No countries data found')
        return
      }
      const country = data.data().latest
      country.unshift({ Country: 'Worldwide', Slug: 'worldwide' })
      this.countries = country
      this.signedUserEmail = user.email
      this.signedUserName = user.displayName
    })
  }

  mounted () {
    setTimeout(() =>
      this.initNewsButton(), 500)
  }
}

</script>
