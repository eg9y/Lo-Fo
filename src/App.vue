<!-- The entry point to our app -->

<template>
  <v-app id="app">
    <nav-bar></nav-bar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navigation/NavBar'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'nav-bar': Navbar
  },
  data () {
    return {}
  },
  computed: {
    ...mapState([
      'firebase',
      'db'
    ]),
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    ...mapActions([
      'updateUserCollection',
      'updateCollection',
      'stillLoading',
      'setUser',
      'setAllLostItems',
      'setAllFoundItems'
    ]),
    /*
      Gets all documents by user from lost-items and found-items collection
      and stores it in lost_items and found_items array
    */
    fetchAllUserDocuments () {
      this.updateUserCollection('lost-items')
      this.updateUserCollection('found-items')
    },
    /*
      Gets all documents from lost-items and found-items collection
      and stores it in lost_items and found_items array
    */
    fetchAllDocuments () {
      this.updateCollection('lost-items')
      this.updateCollection('found-items')
    }
  },
  created () {
    this.firebase.auth().onAuthStateChanged(
      (user) => {
        this.stillLoading(false)
        if (user) {
          // User is signed in.
          this.setUser(user)
          this.fetchAllUserDocuments()
        }
        this.fetchAllDocuments()
      }
    )

    this.db.collection('lost-items')
      .onSnapshot((querySnapshot) => {
        let lostItems = []
        querySnapshot.forEach(function (doc) {
          lostItems.push(doc.data())
        })
        this.setAllLostItems(lostItems)
        if (this.user) {
          this.updateUserCollection('lost-items')
        }
      })

    this.db.collection('found-items')
      .onSnapshot((querySnapshot) => {
        let foundItems = []
        querySnapshot.forEach(function (doc) {
          foundItems.push(doc.data())
        })
        this.setAllFoundItems(foundItems)
        if (this.user) {
          this.updateUserCollection('found-items')
        }
      })
  }
}
</script>
<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  background: #f7f7f7;
  background: -moz-linear-gradient(top, #f7f7f7 0%, #e2e2e2 100%);
  background: -webkit-linear-gradient(top, #f7f7f7 0%, #e2e2e2 100%);
  background: linear-gradient(to bottom, #f7f7f7 0%, #e2e2e2 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f7f7f7', endColorstr='#e2e2e2',GradientType=0 );
}
body {
  background-color: rgb(247, 244, 244);
}
</style>
