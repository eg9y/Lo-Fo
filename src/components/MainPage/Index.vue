<!-- This is the component that displays UCSC map using Google Maps API -->

<template>
  <div style="width: 100%; height: 100%">
    <!-- Alert that pops up when users attempt to create a marker without signing in -->
    <v-alert style="margin=0 0 0 0;"
      v-model="alert"
      dismissible
      type="error"
      icon="icon-location"
      transition="slide-y-transition">
      You must log in to pin!
    </v-alert>

    <side-nav></side-nav>

    <!-- Pop up dialog that includes the submission form -->
    <submission-form id="#submissionDialog"
      :selectedLatLng="selectedLatLng"
      :submissionDialog="submissionDialog"
      :user="user"></submission-form>

    <!-- The UCSC map -->
    <l-map v-if="mapStillLoading"
      id="mapDialogFirst"
      style="height: 100%"
      :zoom="zoom"
      :minZoom="15"
      :maxZoom="18"
      :max-bounds="maxBounds"
      :center="center"
      @click="addLocation"
      ref="map">
      <!-- attribution to OpenStreetMap -->
      <l-tile-layer :url="url"
        :tileLayerClass="tileLayerClass"
        :options="{boundary: $options.boundary}"
        :attribution="attribution"></l-tile-layer>
      <v-marker-cluster :options="clusterOptions"
        :selectedMarker="selectedMarker"
        ref="cluster">

        <!-- found items markers -->
        <ItemsMarkers></ItemsMarkers>
      </v-marker-cluster>
      <!-- selected location -->
      <l-marker v-if="selectedLatLng"
        :lat-lng="accurateLatLng"></l-marker>

    </l-map>
    <template v-else>
      <h1>Map loading...</h1>
    </template>
  </div>
</template>

<script>
import SubmissionForm from './SubmissionForm/Index'
import ItemsMarkers from './Markers/Index'
import SideNav from './SideNav/Index'

import { EventBus } from '../../main'
import { mapState, mapGetters, mapActions } from 'vuex'

import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

// setup marker clustering
import 'leaflet/dist/leaflet.css'
import '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css'
import '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css'

import './BoundaryCanvas.js'

// Configure algolia for search functionality
import algoliasearch from 'algoliasearch'
// configure algolia
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
)
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME)

const MAXLAT = 37.004448819299
const MINLAT = 36.97622678464096
const MAXLNG = -122.04299926757812
const MINLNG = -122.07372665405273

export default {
  boundary: {
    'type': 'Polygon',
    'coordinates': [
      [
        // long lat
        [MINLNG, MAXLAT], // top-right
        [MINLNG, MINLAT], // bottom-right
        [MAXLNG, MINLAT], // bottom-left
        [MAXLNG, MAXLAT] // top-left
      ]
    ]

  },
  components: {
    SubmissionForm,
    ItemsMarkers,
    SideNav,
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
      maxBounds: L.latLngBounds([
        [37.018, -122.1], // top-left
        [36.96, -121.9995] // bottom-right
      ]),
      // lat and lng are used for location
      selectedLatLng: null,
      submissionDialog: false,
      currentMid: null,
      lost_items: [],
      found_items: [],
      triggerPopFound: null,
      alert: false,
      clusterOptions: {},
      tileLayerClass: L.TileLayer.boundaryCanvas
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
      'queriedFirestoreItems',
      'center',
      'zoom',
      'selectedMarker',
      'map',
      'popupClicked',
      'fromSideNav'
    ]),
    accurateLatLng () {
      const point = this.map.latLngToContainerPoint(this.selectedLatLng)
      var newPoint = L.point([point.x - 0.2, point.y + 20])
      return this.map.containerPointToLatLng(newPoint)
    }
  },
  methods: {
    ...mapActions([
      'updateCollection',
      'toggleCluster',
      'setMap',
      'setSelectedMarker',
      'setPopupClicked',
      'getMarkerById',
      'setFromSideNav'
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
      if (this.popupClicked) {
        this.setPopupClicked(false)
        this.setSelectedMarker(null)
        console.log('popup closed')
        return
      }
      const withinLat = e.latlng.lat >= 36.97622678464096 && e.latlng.lat <= 37.004448819299
      const withinLng = e.latlng.lng >= -122.07372665405273 && e.latlng.lng <= -122.04299926757812
      if (!withinLat || !withinLng) {
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
      const picture = markerInfo.picture
      const id = markerInfo.id
      const userID = markerInfo.userID
      const collectionName = (markerInfo.collection === 'lost') ? 'lost-items' : 'found-items'
      this.map.closePopup()
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
        this.updateCollection(collectionName)
        console.log('Document successfully deleted!')
        L.popup()
          .closePopup()
        // deletes entry from algolia
        index.deleteObject(markerInfo.id)
      }).catch(function (error) {
        console.error('Error removing document: ', error)
      })
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
    /*
      Given itemStr, searches for correct item in allLostItems or allFoundItems
      Parameters: itemStr -- string in the form of <x>-<item id>, where item id is the unique id from the database,
      and x is 'l' for items in the lost collection and 'f' for items in the found collection
    */
    setPopup (param) {
      if (param) {
        this.getMarkerById(param)
      }
      if (this.selectedMarker) {
        if (this.$route.path !== '/' && this.fromSideNav) {
          this.map.setView(L.latLng(this.selectedMarker.coordinates.lat, this.selectedMarker.coordinates.lng), 20)
          this.setFromSideNav(false)
        }
        const label = this.selectedMarker.collection === 'lost' ? 'Lost:' : 'Found:'
        const timestamp = this.selectedMarker.time + ' ' + this.selectedMarker.date
        const container = L.DomUtil.create('div')
        container.innerHTML =
          `
          <h1 style="text-align: center;">${label} ${this.selectedMarker.type}</h1>
          <img id="marker-picture" src="${this.selectedMarker.picture || ''}"/>
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
    },
    onLocationFound (e) {
      const radius = e.accuracy / 4
      L.marker(e.latlng).addTo(this.map)
        .bindPopup('You are within ' + radius + ' meters from this point').openPopup()
      L.circle(e.latlng, radius).addTo(this.map)
    }
  },
  watch: {
    queriedFirestoreItems () {
      if (this.$route.params.id) {
        this.setPopup(this.$route.params.id)
      }
    },
    '$route.params.id': {
      immediate: true,
      handler (param) {
        if (param) {
          this.setPopup(param)
        }
      }
    },
    selectedMarker () {
      this.setPopup()
    },
    popupClicked (clicked) {
      if (clicked) {
        this.selectedLatLng = null
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
      this.selectedLatLng = null
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
      this.map.on('locationfound', this.onLocationFound)
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
#marker-picture {
  max-width: 150px;
  width: 100%;
  height: auto;
}
.leaflet-container {
  cursor: url(../../../static/png/pin.png) 10 20, auto !important;
}
#mapDialogFirst {
  z-index: 0;
}
.button {
  background-color: rgb(126, 187, 109);
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
