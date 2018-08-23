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
      'updateCollection',
      'stillLoading',
      'setUser',
      'setQueriedFirestoreItems'
    ])
  },
  created () {
    this.firebase.auth().onAuthStateChanged(
      (user) => {
        this.stillLoading(false)
        if (user) {
          // User is signed in.
          this.setUser(user)
          this.updateCollection()
        }
      }
    )

    this.db.collection('items')
      .onSnapshot((querySnapshot) => {
        let items = []
        querySnapshot.forEach(function (doc) {
          items.push(doc.data())
        })
        this.setQueriedFirestoreItems(items)
      })
  }
}
</script>
<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  background: #dddddd;
  /* background: -moz-linear-gradient(top, #f7f7f7 0%, #e2e2e2 100%);
  background: -webkit-linear-gradient(top, #f7f7f7 0%, #e2e2e2 100%);
  background: linear-gradient(to bottom, #f7f7f7 0%, #e2e2e2 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f7f7f7', endColorstr='#e2e2e2',GradientType=0 ); */
}
/* body {
  background-color: rgb(247, 244, 244);
} */
</style>
