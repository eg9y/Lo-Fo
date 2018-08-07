import {pushDocuments} from './helperFunction'

export const stillLoading = function ({ commit }, loadingStatus) {
  commit('stillLoading', loadingStatus)
}

export const setAllLostItems = function ({ commit }, items) {
  commit('setAllLostItems', items)
}

export const setAllFoundItems = function ({ commit }, items) {
  commit('setAllFoundItems', items)
}

export const pushToCollection = function ({ commit }, colAndDoc) {
  commit('pushToCollection', colAndDoc)
}

/*
    Fetches new submissions from firebase storage and updates the local copy of all lost/found entries
  */
export const updateCollection = function ({ commit }, collectionName) {
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
}

/*
    Fetches new submissions from firebase storage and updates the local copy of all lost/found entries based on query
  */
export const updateCollectionQuery = function ({ commit }, query) {
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
