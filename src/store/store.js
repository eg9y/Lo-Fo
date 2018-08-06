import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import db from '@/firebase/init'

// import * as 'actions' from './actions';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // user object
    isUserLoggedIn: false,
    stillLoading: true,
    lost_items: null,
    found_items: null,
    all_lost_items: null,
    all_found_items: null,
    queried_lost_items: null,
    queried_found_items: null,
    firebase,
    db,
    // if lostToggle/foundToggle is true = display lost/found markers
    // if lostToggle/foundToggle is false = hide lost/found markers
    lostToggle: true,
    foundToggle: true
  },
  getters: {
    firebase (state) {
      return state.firebase
    },
    all_lost_items (state) {
      return state.all_lost_items
    }
  },
  mutations: {
    setUser (state, user) {
      state.isUserLoggedIn = true
      state.user = user
    },
    signOut (state) {
      state.isUserLoggedIn = false
      state.user = null
    },
    stillLoading (state, loadingStatus) {
      state.stillLoading = loadingStatus
    },
    setAllLostItems (state, items) {
      state.all_lost_items = items.map((item) => {
        item.coordinates = L.latLng(item.coordinates.lat, item.coordinates.lng)
        return item
      }) || items
    },
    setAllFoundItems (state, items) {
      state.all_found_items = items.map((item) => {
        item.coordinates = L.latLng(item.coordinates.lat, item.coordinates.lng)
        return item
      }) || items
    },
    setQueriedLostItems (state, items) {
      state.queried_lost_items = items
    },
    setQueriedFoundItems (state, items) {
      state.queried_found_items = items
    },
    setLostItems (state, items) {
      state.lost_items = items
    },
    setFoundItems (state, items) {
      state.found_items = items
    },
    // below four functions are for toggling lost/found pins
    setLostToggleTrue (state) {
      state.lostToggle = true
    },
    setLostToggleFalse (state) {
      state.lostToggle = false
    },
    setFoundToggleTrue (state) {
      state.foundToggle = true
    },
    setFoundToggleFalse (state) {
      state.foundToggle = false
    }
  },
  actions: {
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    signOut ({ commit }) {
      commit('signOut')
    },
    stillLoading ({ commit }, loadingStatus) {
      commit('stillLoading', loadingStatus)
    },
    setAllLostItems ({ commit }, items) {
      commit('setAllLostItems', items)
    },
    setAllFoundItems ({ commit }, items) {
      commit('setAllFoundItems', items)
    },
    pushToCollection ({ commit }, colAndDoc) {
      commit('pushToCollection', colAndDoc)
    },
    /*
      Fetches new submissions from firebase storage and updates the local copy of all lost/found entries
    */
    updateCollection ({ commit }, collectionName) {
      let documents = []
      this.state.db
        .collection(collectionName)
        .get()
        .then(items => {
          pushDocuments(items, documents)
          if (collectionName === 'lost-items') {
            commit('setAllLostItems', documents)
          } else {
            commit('setAllFoundItems', documents)
          }
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    /*
      Fetches new submissions from firebase storage and updates the local copy of the user's lost/found entries
    */
    updateUserCollection ({ commit }, collectionName) {
      let documents = []
      this.state.db
        .collection(collectionName)
        .where('userID', '==', this.state.user.uid)
        .get()
        .then(items => {
          pushDocuments(items, documents)
          if (collectionName === 'lost-items') {
            commit('setLostItems', documents)
          } else {
            commit('setFoundItems', documents)
          }
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    /*
      Fetches new submissions from firebase storage and updates the local copy of all lost/found entries based on query
    */
    updateCollectionQuery ({ commit }, query) {
      let documentsLost = []
      this.state.db
        .collection('lost-items')
        .where('type', '==', query)
        .get()
        .then(lostItems => {
          pushDocuments(lostItems, documentsLost)
          commit('setQueriedLostItems', documentsLost)
          let documentsFound = []
          this.state.db
            .collection('found-items')
            .where('type', '==', query)
            .get()
            .then(foundItems => {
              pushDocuments(foundItems, documentsFound)
              commit('setQueriedFoundItems', documentsFound)
            })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    }
  }
})

function pushDocuments (items, collection) {
  if (items) {
    items.forEach(doc => {
      let dataWithId = doc.data()
      dataWithId.id = doc.id
      // doc.data() is never undefined for query doc snapshots
      collection.push(dataWithId)
    })
  }
  return collection
}
