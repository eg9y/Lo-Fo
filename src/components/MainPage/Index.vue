<!-- This is the component that displays UCSC map using Google Maps API -->

<template>
  <div style="width: 100%; height: 100%">
    <!-- Alert that pops up when users attempt to create a marker without signing in -->
    <v-alert icon="new_releases"
      style="margin=0 0 0 0;"
      v-model="alert"
      dismissible
      type="error"
      transition="slide-y-transition">
      You must log in to pin!
    </v-alert>

    <!-- Pop up dialog that includes the submission form -->
    <submission-form :selectedLatLng="selectedLatLng"
      :submissionDialog="submissionDialog"
      :user="user"></submission-form>

    <!-- The UCSC map -->
    <l-map id="mapDialogFirst"
      style="height: 100%"
      :zoom="zoom"
      :center="center"
      :max-bounds="maxBounds"
      @click="addLocation"
      ref="map">
      <!-- attribution to OpenStreetMap -->
      <l-tile-layer :url="url"
        :attribution="attribution"></l-tile-layer>
      <v-marker-cluster :options="clusterOptions">

        <!-- found items markers -->
        <found-items-markers v-if="foundToggle"
          :selectedFoundMarker="selectedFoundMarker"
          @deleteMarker="deleteMarker"></found-items-markers>

        <!-- lost items markers -->
        <lost-items-markers v-if="lostToggle"
          @deleteMarker="deleteMarker"></lost-items-markers>

        <!-- selected location -->
        <l-marker v-if="selectedLatLng"
          :lat-lng="selectedLatLng"></l-marker>
      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
import SubmissionForm from './SubmissionForm/Index'
import FoundItemsMarkers from './Markers/FoundItemsMarkers/Index'
import LostItemsMarkers from './Markers/LostItemsMarkers/Index'
import { EventBus } from '../../main'
import { mapState, mapGetters, mapActions } from 'vuex'

import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

import 'leaflet/dist/leaflet.css'
import '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css'
import '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css'

export default {
  components: {
    SubmissionForm,
    FoundItemsMarkers,
    LostItemsMarkers,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  name: 'Map',
  data () {
    return {
      marker: L.latLng(36.994635, -122.058842),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      bounds: L.latLngBounds([[36.972855, -122.085947], [37.009252, -122.036793]]),
      maxBounds: L.latLngBounds([[36.972855, -122.085947], [37.009252, -122.036793]]),
      // lat and lng are used for location
      selectedLatLng: null,
      submissionDialog: false,
      currentMid: null,
      lost_items: [],
      found_items: [],
      triggerPopFound: null,
      selectedFoundMarker: null,
      alert: false,
      clusterOptions: {}
    }
  },
  computed: {
    ...mapState([
      'db',
      'firebase'
    ]),
    ...mapGetters([
      'isUserLoggedIn',
      'user',
      'stillLoading',
      'allLostItems',
      'allFoundItems',
      'lostToggle',
      'foundToggle',
      'center',
      'zoom',
      'selectedLostMarker'
    ]),
    mapOptions () {
      return {
        minZoom: 17,
        maxZoom: 18,
        gestureHandling: this.$vuetify.breakpoint.width >= '710' ? 'cooperative' : 'greedy',
        draggableCursor: 'url(http://s3.amazonaws.com/besport.com_images/status-pin.png), auto'
      }
    }
  },
  methods: {
    ...mapActions([
      'updateUserCollection',
      'updateCollection',
      'toggleCluster',
      'setSelectedLostMarker'
    ]),
    /*
      Updates the location for a new potential marker, and opens the submission form
      Parameters: e -- event object from clicking the map
    */
    addLocation (e) {
      if (!this.isUserLoggedIn) {
        this.alert = true
        return
      }
      this.selectedLatLng = e.latlng
      // // open the submission form
      this.submissionDialog = true
    },
    /*
      Deletes the marker's associated entry in the db, and deletes the picture from Storage if applicable
    */
    deleteMarker (markerInfo) {
      // deletes associated picture if item has one, and it's stored in Storage
      const picture = markerInfo[0]
      const id = markerInfo[1]
      const userID = markerInfo[2]
      const collectionName = markerInfo[3]

      if (picture && picture.includes(userID)) {
        var picRef = this.firebase.storage().refFromURL(picture)
        picRef.delete().then(function () {
          console.log('Image successfully deleted from Storage')
          // eslint-disable-next-line
        }).catch(function (error) {
          console.log('Error in deleting image from Storage')
        })
      }

      // deletes the entry from the db and then updates the local copies
      this.db.collection(collectionName).doc(id).delete().then(() => {
        this.updateUserCollection(collectionName)
        this.updateCollection(collectionName)
        console.log('Document successfully deleted!')
      }).catch(function (error) {
        console.error('Error removing document: ', error)
      })
    },
    /*
      Given itemStr, searches for correct item in allLostItems or allFoundItems
      Parameters: itemStr -- string in the form of <x>-<item id>, where item id is the unique id from the database,
      and x is 'l' for items in the lost collection and 'f' for items in the found collection
    */
    findMarker (itemStr) {
      console.log('findMarker is running, looking for: ' + itemStr)
      const itemID = itemStr.substr(2)
      if (itemStr[0] === 'f') {
        this.selectedFoundMarker = itemID
        this.setSelectedLostMarker(null)
      } else {
        this.setSelectedLostMarker(itemID)
        this.selectedFoundMarker = null
      }
    }
  },
  watch: {
    allLostItems () {
      if (this.$route.params.id) {
        // this.findMarker(this.$route.params.id)
      }
    },
    allFoundItems () {
      if (this.$route.params.id) {
        // this.findMarker(this.$route.params.id)
      }
    },
    '$route.params.id': {
      immediate: true,
      handler (val) {
        if (val) {
          this.findMarker(val)
        }
      }
    },
    clusterOn (status) {
      // if no cluster
      if (!status) {
        setTimeout(() => {
          this.toggleCluster(true)
        }, 2000)
      }
    }
  },
  created () {
    EventBus.$on('toggleSubmission', (submission) => {
      if (this.submission === true) {
        this.lat = null
        this.lng = null
      }
      this.submissionDialog = false
    })
    EventBus.$on('newCenter', (newCenter) => {
      this.center = {
        lat: newCenter.coordinates.lat,
        lng: newCenter.coordinates.lng
      }
    })
  },
  /*
    Set up clustering options
  */
  mounted () {
    setTimeout(() => {
      console.log('done')
      this.$nextTick(() => {
        this.clusterOptions = {
          animateAddingMarkers: false,
          disableClusteringAtZoom: 11
        }
      })
    }, 5000)
  },
  filters: {
    /*
      Define truncate filter to replace long words with ...
    */
    truncate (text) {
      let newText = text
      if (typeof (newText) === 'string' && newText.length > 14) {
        newText = newText.substring(0, 14)
        newText += '...'
      }
      return newText
    }
  }
}
</script>

<style>
img {
  width: 100%;
  height: auto;
}
#mapDialogFirst {
  z-index: 0;
}
</style>
