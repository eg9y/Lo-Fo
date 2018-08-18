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
    <l-map v-if="mapStillLoading"
      id="mapDialogFirst"
      style="height: 100%"
      :zoom="zoom"
      :center="center"
      :max-bounds="maxBounds"
      @click="addLocation"
      ref="map">
      <!-- attribution to OpenStreetMap -->
      <l-tile-layer :url="url"
        :attribution="attribution"></l-tile-layer>
      <v-marker-cluster :options="clusterOptions"
        ref="cluster">

        <!-- found items markers -->
        <found-items-markers v-if="foundToggle"
          @deleteMarker="deleteMarker"></found-items-markers>

        <!-- lost items markers -->
        <lost-items-markers v-if="lostToggle"></lost-items-markers>
      </v-marker-cluster>
      <!-- selected location -->
      <l-marker v-if="selectedLatLng"
        :lat-lng="selectedLatLng"></l-marker>

    </l-map>
    <template v-else>
      <h1>Map loading...</h1>
    </template>
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
      'mapStillLoading',
      'allLostItems',
      'allFoundItems',
      'lostToggle',
      'foundToggle',
      'center',
      'zoom',
      'selectedMarker',
      'map'
    ])
  },
  methods: {
    ...mapActions([
      'updateUserCollection',
      'updateCollection',
      'toggleCluster',
      'setZoomEnd',
      'setAllowPopupOnZoom',
      'setCluster',
      'setMap'
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
      console.log('hi')
      // const picture = markerInfo.picture
      // const id = markerInfo.id
      // const userID = markerInfo.userID
      // const collectionName = (markerInfo.collection === 'lost') ? 'lost-items' : 'found-items'
      // if (picture && picture.includes(userID)) {
      //   var picRef = this.firebase.storage().refFromURL(picture)
      //   picRef.delete().then(function () {
      //     console.log('Image successfully deleted from Storage')
      //     // eslint-disable-next-line
      //   }).catch(function (error) {
      //     console.log('Error in deleting image from Storage')
      //   })
      // }

      // deletes the entry from the db and then updates the local copies
      // this.db.collection(collectionName).doc(id).delete().then(() => {
      //   this.updateUserCollection(collectionName)
      //   this.updateCollection(collectionName)
      //   console.log('Document successfully deleted!')
      // }).catch(function (error) {
      //   console.error('Error removing document: ', error)
      // })
    },
    /*
      Given itemStr, searches for correct item in allLostItems or allFoundItems
      Parameters: itemStr -- string in the form of <x>-<item id>, where item id is the unique id from the database,
      and x is 'l' for items in the lost collection and 'f' for items in the found collection
    */
    findMarker (itemStr) {
      console.log('findMarker is running, looking for: ' + itemStr)
    },
    createButton (label, container) {
      var btn = L.DomUtil.create('button', '', container)
      btn.setAttribute('type', 'button')
      btn.setAttribute('id', 'test')
      btn.setAttribute('class', 'button')
      btn.innerHTML = label
      L.DomEvent.on(container, 'click', () => {
        this.deleteMarker(this.selectedMarker)
      })
      return btn
    },
    setPopup () {
      if (this.selectedMarker) {
        const timestamp = this.selectedMarker.time + ' ' + this.selectedMarker.date
        const container = L.DomUtil.create('div')
        container.innerHTML =
          `
          <h1 style="text-align: center;">Lost: ${this.selectedMarker.type}</h1>
          <img src="${this.selectedMarker.picture || ''}"/>
          <h3>${this.selectedMarker.description}</h3>
          <h3>${timestamp}</h3>
          <h3>${this.selectedMarker.contactEmail}</h3>
          `

        if (this.isUserLoggedIn && this.user.uid === this.selectedMarker.userID) {
          this.createButton('Resolve', container)
        }

        L.popup()
          .setLatLng(L.latLng([this.selectedMarker.coordinates.lat, this.selectedMarker.coordinates.lng]))
          .setContent(container)
          .openOn(this.map)
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
          this.setPopup()
        }
      }
    },
    selectedMarker () {
      this.setPopup()
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
  },
  /*
    Set up clustering options
  */
  mounted () {
    this.$nextTick(() => {
      this.clusterOptions = {
        animateAddingMarkers: false,
        disableClusteringAtZoom: 11
      }
      this.setMap(this.$refs.map.mapObject)
      this.setPopup()
    })
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

.button {
  background-color: rgb(214, 78, 78);
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>
