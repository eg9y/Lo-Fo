<template>
  <l-marker :lat-lng="lostItem.coordinates"
    :icon="icon"
    :ref="`l${lostItem.id}`"
    @click="test"
    >
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
    test () {
      this.setSelectedMarker(this.lostItem)
      const itemID = this.lostItem.id
      const collectionType = this.lostItem.collection === 'lost' ? 'l' : 'f'
      this.$router.push(`/${collectionType}-${itemID}`)
    }
  },
  computed: {
    icon () {
      return L.icon({
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/lost_icon.png?alt=media&token=bc3b089f-1bfe-4cec-867b-aaa9ab75bd46',
        iconSize: [32, 32],
        iconAnchor: [20, 20]
      })
    }
  }
}
</script>
