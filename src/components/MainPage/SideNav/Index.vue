<template>
  <v-navigation-drawer v-if="!stillLoading"
    clipped
    app
    dark
    id="uniformFont"
    fixed>
    <v-list dense>
      <v-list-tile>
        <v-layout>
          <v-flex xs6>
            <v-btn @click="displayLost"
              :disabled="!foundToggle"
              color="red"
              block>
              <v-icon v-if="lostToggle">icon-check</v-icon>
              <v-icon v-else>icon-check-empty</v-icon>
              Lost
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn @click="displayFound"
              :disabled="!lostToggle"
              color="green"
              block>
              <v-icon v-if="foundToggle">icon-check</v-icon>
              <v-icon v-else>icon-check-empty</v-icon>
              Found
            </v-btn>
          </v-flex>
        </v-layout>
      </v-list-tile>
      <v-list-tile v-for="item in queriedFirestoreItems"
        :key="item.id">
        <v-layout>
          <v-flex xs12>
            <v-btn block
              :color="setColor(item.collection)"
              @click="focus(item)">
              {{item.category}} | {{ item.type }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-list-tile>
      <v-list-tile>
        <v-layout>
          <v-flex xs6>
            <v-btn block
              @click="goToPrevPage">
              Prev
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block
              @click="goToNextPage">
              Next
            </v-btn>
          </v-flex>
        </v-layout>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      displayMenu: false,
      page: 1
    }
  },
  computed: {
    ...mapGetters([
      'lostToggle',
      'foundToggle',
      'stillLoading',
      'map',
      'queriedFirestoreItems',
      'selectedMarker'
    ]),
    pageZeroIndexed () {
      return this.page - 1
    }
  },
  methods: {
    ...mapMutations([
      'setLostToggle',
      'setFoundToggle'
    ]),
    ...mapActions([
      'setSelectedMarker',
      'queryFirestoreItemsNext',
      'queryFirestoreItemsPrev',
      'setFromSideNav'
    ]),
    focus (submission) {
      this.setSelectedMarker(submission)
      // Sets new zoom and center value for map
      this.map.setView(L.latLng(submission.coordinates.lat, submission.coordinates.lng), 20)
      const symbol = submission.collection === 'lost' ? 'l' : 'f'
      this.$router.push(`/${symbol}-${submission.id}`)
      this.setFromSideNav(true)
    },
    setColor (collection) {
      return collection === 'lost' ? 'red darken-2' : 'green darken-2'
    },
    goToNextPage () {
      this.queryFirestoreItemsNext()
    },
    goToPrevPage () {
      this.queryFirestoreItemsPrev()
    },
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

<style>
</style>
