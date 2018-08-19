<template>
  <l-marker :lat-lng="foundItem.coordinates"
    :icon="icon"
    :ref="`f${foundItem.id}`"
    @click="setMarker">
  </l-marker>
</template>

<script>
import { LMarker, LPopup } from 'vue2-leaflet'
import { mapActions } from 'vuex'

export default {
  props: ['foundItem'],
  components: {
    LMarker,
    LPopup
  },
  data () {
    return {
      marker: null
    }
  },
  methods: {
    ...mapActions([
      'setSelectedMarker',
      'setPopupClicked'
    ]),
    setMarker () {
      this.setPopupClicked(true)
      this.setSelectedMarker(this.foundItem)
      const itemID = this.foundItem.id
      const collectionType = this.foundItem.collection === 'lost' ? 'l' : 'f'
      this.$router.push(`/${collectionType}-${itemID}`)
    }
  },
  computed: {
    icon () {
      return L.icon({
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/found_marker.png?alt=media&token=819906a9-f325-49d3-826f-2800588d8277',
        iconSize: [24, 24],
        iconAnchor: [20, 20]
      })
    }
  }
}
</script>
