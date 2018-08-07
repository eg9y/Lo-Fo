<template>
  <l-marker
    :lat-lng="foundItem.coordinates"
    :icon="icon"
    :ref="`f${foundItem.id}`"
  >
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

export default {
  props: ['foundItem', 'selectedFoundMarker'],
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
    icon () {
      return L.icon({
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/found_icon.png?alt=media&token=7b310ae5-11a2-4f74-b9fb-38bb123257d3',
        iconSize: [32, 32],
        iconAnchor: [20, 20]
      })
    }
  },
  methods: {
    popUp (selectedFoundMarker) {
      const thisIsTheSelectedMarker = selectedFoundMarker === this.foundItem.id
      if (this.marker && thisIsTheSelectedMarker) {
        this.marker.mapObject.openPopup()
      }
    }
  },
  watch: {
    selectedFoundMarker: {
      immediate: true,
      handler (selectedFoundMarker) {
        this.popUp(selectedFoundMarker)
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.marker = this.$refs['f' + this.foundItem.id]
      this.popUp(this.selectedFoundMarker)
    })
  }

}
</script>
