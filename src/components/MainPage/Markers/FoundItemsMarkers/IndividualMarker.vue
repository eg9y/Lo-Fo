<template>
  <l-marker :lat-lng="foundItem.coordinates"
            :icon="icon" :ref="`f${foundItem.id}`">
    <l-popup>
      <v-layout>
        <v-flex class="text-xs-center">
          <transition name="fade">
            <h1 style="text-align: center;">Found: {{foundItem.type}}</h1>
          </transition>
          <progressive-img v-if="foundItem.picture"
                           :src="foundItem.picture"
                           :alt="foundItem.type" />
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <h3>{{foundItem.description}}</h3>
          <h3>{{foundItem.timestamp}}</h3>
          <h3>{{foundItem.contactEmail}}</h3>
        </v-flex>
      </v-layout>
      <div class="text-xs-center">
        <v-btn v-if="isUserLoggedIn && user.uid == foundItem.userID"
               @click="emitDelete(foundItem)"
               color="error">
          Resolve
        </v-btn>
      </div>
    </l-popup>
  </l-marker>
</template>

<script>
import { EventBus } from '../../../../main'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import { mapState } from 'vuex'

export default {
  props: ['foundItem', 'selectedMarker'],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      marker: null
    }
  },
  methods: {
    emitDelete (foundItem) {
      EventBus.$emit('deleteMarker', [foundItem.pictures, foundItem.id, foundItem.userID, 'found-items'])
    }
  },
  computed: {
    icon () {
      return L.icon({
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/found_icon.png?alt=media&token=7b310ae5-11a2-4f74-b9fb-38bb123257d3',
        iconSize: [32, 32],
        iconAnchor: [20, 20]
      })
    },
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  mounted () {
    this.$nextTick(function () {
      this.marker = this.$refs['f' + this.foundItem.id]
      const thisIsTheSelectedMarker = this.selectedMarker === this.foundItem.id
      if (this.marker && thisIsTheSelectedMarker) {
        this.marker.mapObject.openPopup()
      }
    })
  }
}
</script>

<style>
</style>
