<!-- The display button in the nav bar that opens a drop down menu -->

<template>
  <v-menu v-model="displayMenu"
    offset-y
    :close-on-content-click="false">
    <v-btn slot="activator"
      id="display-button"
      flat>
      <v-icon left
        color="display">icon-th-list</v-icon>
      Display
    </v-btn>
    <v-list>
      <v-list-tile @click="displayLost">
        <v-icon v-if="lostToggle">icon-check</v-icon>
        <v-icon v-else>icon-check-empty</v-icon>
        Lost Markers
      </v-list-tile>
      <v-list-tile @click="displayFound">
        <v-icon v-if="foundToggle">icon-check</v-icon>
        <v-icon v-else>icon-check-empty</v-icon>
        Found Markers
      </v-list-tile>
      <v-list-tile>
        <v-btn block
          to="/display"
          @click="displayMenu=false">
          List View
        </v-btn>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      displayMenu: false
    }
  },
  computed: {
    ...mapGetters([
      'lostToggle',
      'foundToggle'
    ])
  },
  methods: {
    ...mapMutations([
      'setLostToggle',
      'setFoundToggle'
    ]),
    /*
      Displays the lost markers if the lost_checkbox is checked
    */
    displayLost () {
      if (this.lostToggle) {
        this.setLostToggle(false)
      } else {
        this.setLostToggle(true)
      }
    },
    /*
      Displays the found markers if the found_checkbox is checked
    */
    displayFound () {
      if (this.foundToggle) {
        this.setFoundToggle(false)
      } else {
        this.setFoundToggle(true)
      }
    }
  }
}
</script>
<style scoped>
#display-button {
  background-color: #006aad !important;
}
</style>
