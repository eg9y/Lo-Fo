<template>
  <l-marker :lat-lng="lostItem.coordinates"
    :icon="icon"
    :ref="`l${lostItem.id}`"
    @click="setMarker">
  </l-marker>
</template>

<script>
import { LMarker, LPopup } from 'vue2-leaflet'
import { mapActions } from 'vuex'

export default {
  props: ['lostItem'],
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
      'setSelectedMarker'
    ]),
    setMarker () {
      this.setSelectedMarker(this.lostItem)
      const itemID = this.lostItem.id
      const collectionType = this.lostItem.collection === 'lost' ? 'l' : 'f'
      this.$router.push(`/${collectionType}-${itemID}`)
    }
  },
  computed: {
    icon () {
      return L.icon({
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/lost_marker.png?alt=media&token=a84b3255-0d57-4ec3-9969-06242ba745ef',
        iconSize: [24, 24],
        iconAnchor: [20, 20]
      })
    }
  }
}
</script>
