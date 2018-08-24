<!-- The navigation bar at the top of the web app -->

<template>
  <div>
    <v-toolbar dark
      app
      dense
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
        <v-toolbar-items v-if="$route.name !== 'Display'">
          <v-btn slot="activator"
            id="display-button"
            to="/display"
            flat>
            <v-icon left>icon-th-list</v-icon>
            Display
          </v-btn>
        </v-toolbar-items>
      </template>

      <!-- Desktop View -->
      <template v-if="$vuetify.breakpoint.width >= 710">
        <v-toolbar-side-icon>
          <v-icon>icon-cog</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title>
          <v-btn to="/">
            Lo-Fo
          </v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items v-if="$route.name !== 'Display'">
          <v-btn slot="activator"
            id="display-button"
            to="/display"
            flat>
            <v-icon left>icon-th-list</v-icon>
            Detailed Display
          </v-btn>
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

          <v-btn @click="signOut"
            id="signout-button"
            flat>
            <v-icon left
              color="signOut">icon-logout</v-icon> Sign Out
          </v-btn>
        </v-toolbar-items>
      </template>
    </v-toolbar>

    <!-- Loading bar -->
    <template v-else>
      <v-progress-linear :indeterminate="true"
        color="info"></v-progress-linear>
    </template>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
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
#display-button {
  background-color: #006aad !important;
}
#profile-image {
  max-width: 30px;
  border: 1px solid black;
}
</style>
