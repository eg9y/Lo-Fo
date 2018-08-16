<template>
  <l-marker :lat-lng="lostItem.coordinates"
    :icon="icon"
    :ref="`l${lostItem.id}`">
    <l-popup>
      <v-layout>
        <v-flex class="text-xs-center">
          <slot name="header"></slot>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <slot name="body"></slot>
        </v-flex>
      </v-layout>
      <slot name="interaction"></slot>
    </l-popup>
  </l-marker>
</template>

<script>
import { LMarker, LPopup } from 'vue2-leaflet'
import { mapActions, mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters([
      'selectedLostMarker'
    ]),
    icon () {
      return L.icon({
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/lost_icon.png?alt=media&token=bc3b089f-1bfe-4cec-867b-aaa9ab75bd46',
        iconSize: [32, 32],
        iconAnchor: [20, 20]
      })
    }
  },
  methods: {
    ...mapActions([
      'setCenter',
      'setZoom',
      'toggleCluster',
      'setSelectedLostMarker'
    ]),
    popUp (selectedLostMarker) {
      const thisIsTheSelectedMarker = selectedLostMarker === this.lostItem.id
      if (this.marker && thisIsTheSelectedMarker) {
        this.setZoom(20)
        this.setCenter(L.latLng(this.lostItem.coordinates.lat, this.lostItem.coordinates.lng))
        setTimeout(() => {
          this.marker.mapObject.openPopup()
        }, 0)
      }
    }
  },
  watch: {
    selectedLostMarker: {
      immediate: true,
      handler (selectedLostMarker) {
        this.popUp(selectedLostMarker)
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.marker = this.$refs['l' + this.lostItem.id]
      this.popUp(this.selectedLostMarker)
    })
  }
}
</script>
