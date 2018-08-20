<!-- The navigation bar at the top of the web app -->

<template>
  <div>
    <v-toolbar dark
      app
      fixed
      clipped-left
      v-if="!stillLoading">

      <!-- Mobile View -->
      <template v-if="$vuetify.breakpoint.width < 710">
        <v-toolbar-items>
          <v-btn id="home-button"
            dark
            router
            to="/"
            class="">
            <v-icon>icon-home-1</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-menu :nudge-width="100">
          <v-toolbar-title slot="activator">
            <v-toolbar-side-icon>
              <v-icon>icon-cog</v-icon>
            </v-toolbar-side-icon>
          </v-toolbar-title>
          <v-list>
            <v-list-tile v-if="!this.isUserLoggedIn"
              @click="auth"
              id="signin-button">
              <v-list-tile-title>
                <v-icon>play_arrow</v-icon>
                Sign In
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-else
              @click="signOut"
              id="signout-button">
              <v-list-tile-title>
                <v-icon>icon-logout</v-icon> Sign Out
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="this.isUserLoggedIn"
              id="profile-button"
              light
              to="/profile">
              <v-list-tile-title>
                {{user.displayName}}
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <display-button v-if="mapStillLoading"></display-button>
        </v-toolbar-items>
      </template>

      <!-- Desktop View -->
      <template v-if="$vuetify.breakpoint.width >= 710">
        <v-toolbar-title class="white--text">
          <v-btn flat
            to="/">
            Lo-Fo
          </v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- Home button -->
        <v-toolbar-items>
          <v-btn id="home-button"
            v-if="this.isUserLoggedIn && $route.name === 'Map'"
            @click.stop="drawer = !drawer"
            flat>
            <v-icon left>icon-box</v-icon>
            My Items
          </v-btn>
          <display-button v-if="$route.name !== 'Display'"></display-button>
        </v-toolbar-items>

        <!-- Sign in/out buttons -->
        <v-toolbar-items v-if="!this.isUserLoggedIn">
          <v-btn @click="auth"
            id="signin-button"
            flat>
            <v-icon>icon-login</v-icon>
            Sign In
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-else>
          <v-btn @click="signOut"
            id="signout-button"
            flat>
            <v-icon left
              color="signOut">icon-logout</v-icon> Sign Out
          </v-btn>
          <v-btn id="profile-button"
            light
            to="/profile"
            flat>
            <v-layout>
              <v-flex mr-2>
                <v-avatar :tile="true"
                  :size="30"
                  color="grey lighten-4">
                  <img id="profile-image"
                    :src="user.photoURL"
                    alt="">
                </v-avatar>
              </v-flex>
              <v-flex mt-1>
                {{user.displayName}}
              </v-flex>
            </v-layout>
          </v-btn>
        </v-toolbar-items>
      </template>
    </v-toolbar>

    <!-- Loading bar -->
    <template v-else>
      <v-progress-linear :indeterminate="true"
        color="info"></v-progress-linear>
    </template>

    <!-- Side nav drawer -->
    <side-nav :mainDrawer="drawer"></side-nav>
  </div>
</template>

<script>
import SideNav from './SideNav/Index'
import DisplayButton from './DisplayButton'
import { mapState, mapGetters, mapActions } from 'vuex'
import { EventBus } from '../../main'

export default {
  components: {
    SideNav,
    DisplayButton
  },
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapState([
      'firebase'
    ]),
    ...mapGetters([
      'isUserLoggedIn',
      'user',
      'stillLoading',
      'mapStillLoading'
    ])
  },
  methods: {
    ...mapActions([
      'signOut'
    ]),
    /*
      Redirects to Google authentication
    */
    auth () {
      var provider = new this.firebase.auth.GoogleAuthProvider()
      this.firebase.auth().useDeviceLanguage()
      provider.setCustomParameters({
        'login_hint': 'cruzid@ucsc.edu'
      })
      this.firebase.auth().signInWithRedirect(provider)
    }
  },
  created () {
    EventBus.$on('toggleDrawer', function () {
      this.drawer = false
    }.bind(this))
  }
}
</script>
<style scoped>
#home-button {
  background-color: #003c6c !important;
}
#signout-button {
  background-color: #da216d !important;
}
#signin-button {
  background-color: #93c02d !important;
}
#profile-button {
  background-color: #fdc700 !important;
}
#profile-image {
  max-width: 30px;
  border: 1px solid black;
}
</style>
