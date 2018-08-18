import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import db from '@/firebase/init'
import userModule from './modules/user'

import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

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
    queriedLostItems: null,
    queriedFoundItems: null,
    firebase,
    db,
    // if lostToggle/foundToggle is true = display lost/found markers
    // if lostToggle/foundToggle is false = hide lost/found markers
    lostToggle: true,
    foundToggle: true,
    center: L.latLng([36.991326, -122.058761]),
    zoom: 16,
    selectedMarker: null,
    map: null,
    popupClicked: false
  },
  getters,
  mutations,
  actions
})
