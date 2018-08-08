import {pushDocuments} from '../helperFunction'

const state = {
  user: null, // user object
  lost_items: null,
  found_items: null
}

const getters = {
  user (state) {
    return state.user
  },
  isUserLoggedIn (state) {
    return !!state.user
  },
  lost_items (state) {
    return state.lost_items
  },
  found_items (state) {
    return state.found_items
  }
}

const mutations = {
  setUser (state, user) {
    state.isUserLoggedIn = true
    state.user = user
  },
  signOut (state) {
    state.isUserLoggedIn = false
    state.user = null
  },
  setLostItems (state, items) {
    state.lost_items = items
  },
  setFoundItems (state, items) {
    state.found_items = items
  }
}

const actions = {
  setUser ({ commit }, user) {
    commit('setUser', user)
  },
  signOut ({ commit }) {
    commit('signOut')
  },
  /*
      Fetches new submissions from firebase storage and updates the local copy of the user's lost/found entries
    */
  updateUserCollection ({ state, commit, rootState }, collectionName) {
    let documents = []
    rootState.db
      .collection(collectionName)
      .where('userID', '==', state.user.uid)
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
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
