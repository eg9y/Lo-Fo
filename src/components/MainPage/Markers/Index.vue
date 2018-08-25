<template>
  <div>
    <individual-marker v-for="item in queriedFirestoreItems"
      v-if="filterToggle(item)"
      :key="item.id"
      :item="item">
    </individual-marker>
    <!-- selected marker -->
    <l-marker v-if="checkSelectedMarker(selectedMarker)"
      :icon="$options.icon(selectedMarker.collection)"
      :lat-lng="selectedMarker.coordinates">
    </l-marker>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndividualMarker from './IndividualMarker'
import { LMarker } from 'vue2-leaflet'

export default {
  icon (collection) {
    let url = 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/found_marker.png?alt=media&token=819906a9-f325-49d3-826f-2800588d8277'
    if (collection === 'lost') {
      url = 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/lost_marker.png?alt=media&token=a84b3255-0d57-4ec3-9969-06242ba745ef'
    }
    return L.icon({
      iconUrl: url,
      iconSize: [24, 24],
      iconAnchor: [20, 20]
    })
  },
  components: {
    IndividualMarker,
    LMarker
  },
  computed: {
    ...mapGetters([
      'queriedFirestoreItems',
      'isUserLoggedIn',
      'user',
      'foundToggle',
      'lostToggle',
      'selectedMarker'
    ])
  },
  methods: {
    filterToggle (item) {
      return (this.foundToggle && item.collection === 'found') || (this.lostToggle && item.collection === 'lost')
    },
    checkSelectedMarker (selectedMarker) {
      if (!this.queriedFirestoreItems || !this.selectedMarker) {
        return false
      }
      return this.queriedFirestoreItems.forEach((item) => {
        if (item.id === this.selectedMarker.id) {
          return false
        }
      })
    }
  }
}
</script>
