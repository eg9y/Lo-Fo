<template>
    <div>
        <l-marker
        v-for="lostItem in all_lost_items"
        :key="lostItem.id"
        :lat-lng="lostItem.coordinates"
        :ref="`l-${lostItem.type}`"
        :icon="icon"
      >
        <l-popup>
          <v-layout>
            <v-flex class="text-xs-center">
              <transition name="fade">
                <h1 style="text-align: center;">Lost: {{lostItem.type}}</h1>
              </transition>
              <progressive-img v-if="lostItem.picture" :src="lostItem.picture" :alt="lostItem.type" />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <h3>{{lostItem.description}}</h3>
              <h3>{{lostItem.timestamp}}</h3>
              <h3>{{lostItem.contactEmail}}</h3>
            </v-flex>
          </v-layout>
          <div class="text-xs-center">
            <v-btn
              v-if="isUserLoggedIn && user.uid == lostItem.userID"
              @click="emitDelete(lostItem)"
              color="error">
              Resolve
            </v-btn>
          </div>
        </l-popup>
      </l-marker>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  computed: {
    ...mapState([
      'all_lost_items',
      'isUserLoggedIn',
      'user'
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
    emitDelete (lostItem) {
      this.$emit('deleteMarker', [lostItem.pictures, lostItem.id, lostItem.userID, 'lost-items'])
    }
  }
}
</script>

<style>

</style>
