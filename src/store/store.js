import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import db from '@/firebase/init'

import userModule from './modules/user'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

// Configure algolia for search functionality
import algoliasearch from 'algoliasearch'

// configure algolia
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
)

const algoliaIndex = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME)

algoliaIndex.setSettings({
  attributesToHighlight: [
    'type',
    'description',
    'date',
    'time',
    'contactEmail',
    'category'
  ],
  attributesForFaceting: [
    'type',
    'description',
    'date',
    'time',
    'contactEmail',
    'category'
  ]
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userModule
  },
  state: {
    stillLoading: true,
    mapStillLoading: true,
    allLostItems: null,
    allFoundItems: null,
    queriedItems: null,
    nbHits: 0,
    nbPages: 0,
    firebase,
    db,
    algoliaIndex,
    // if lostToggle/foundToggle is true = display lost/found markers
    // if lostToggle/foundToggle is false = hide lost/found markers
    lostToggle: true,
    foundToggle: true,
    center: L.latLng([36.99015, -122.052362961]),
    zoom: 15,
    selectedMarker: null,
    map: null,
    popupClicked: false,
    queryDate: null,
    queryCategory: null,
    queryTime: null
  },
  getters,
  mutations,
  actions
})
