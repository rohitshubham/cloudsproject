<template>
  <div id="app">
     <div class="md-layout">
      <div class="md-layout-item md-elevation-2" style="margin: 1%;">
          <a href="/">
            <div class="header">
              <img class= "coronavirus-image" :src="imageUrl" alt="Coronavirus">
              <h1>Covid-19 Information Center</h1>
            </div>
          </a>
        <div class="actions md-layout md-alignment-center-space-between">
            <a></a>
            <md-button v-if="!isUserSignedIn" class="md-raised md-primary" @click="auth">Log in</md-button>
            <md-button v-if="isUserSignedIn" class="md-raised md-primary" @click="signOut">Log Out</md-button>
        </div>
      </div>
  </div>
  <div v-if="isUserSignedIn">
    <news></news>
  </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
span {
  width: 100%;
  height: 100%;
  padding: 8px;
  display: block;
}
.padding-class{
    margin: 1%;
}

.header img {
  width: 50px;
  height: 50px;
  float: left;
  margin-right: 10px;
}

.header h1 {
  position: relative;
  width: max-content;
  float: left;
}

.header{
  margin: auto;
  width:30%;
}
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HomePage from '@/views/HomePage.vue'
import News from '@/components/Modal/News.vue'
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'

declare let firebaseObj: any | undefined

@Component({
  components: {
    HomePage,
    News
  }
})
export default class App extends Vue {
  private imageUrl= ''
  private token
  private user
  private isUserSignedIn = false

  private initApp (): void {
    const storage = firebaseObj.storage()
    const gsReference = storage.refFromURL('gs://covid19-fa2c0.appspot.com/23312-min(1).jpg')

    gsReference.getDownloadURL().then((url) => {
      this.imageUrl = url
    })
    this.getUser()
  }

  private getUser () {
    this.user = firebaseObj.auth().currentUser

    if (this.user) {
      this.isUserSignedIn = true
    } else {
      this.isUserSignedIn = false
    }
  }

  private signOut () {
    firebaseObj.auth().signOut().then(() => {
      this.user = null
      this.token = null
      this.isUserSignedIn = false
    }).catch(function (error) {
      console.log(error)
    })
  }

  private auth () {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebaseObj.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      firebaseObj.auth().signInWithPopup(provider).then((result: any) => {
        if (result !== undefined) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          this.token = result!.credential.accessToken
          // The signed-in user info

          this.user = result.user
          this.isUserSignedIn = true
        }
      }).catch((error) => {
        // Handle Errors here.
        console.log(error.code)
        console.log(error.message)
        const credential = error.credential
      })
    })
  }

  mounted () {
    setTimeout(() =>
      this.initApp(),
    500
    )
  }
}
</script>
