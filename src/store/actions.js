import { pushDocuments } from './helperFunction'

export const stillLoading = function ({ commit }, loadingStatus) {
  commit('stillLoading', loadingStatus)
}

export const toggleMapStillLoading = function ({ commit }, loadingStatus) {
  commit('toggleMapStillLoading', loadingStatus)
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

export const setZoom = function ({ commit }, newZoom) {
  commit('setZoom', newZoom)
}

export const setCenter = function ({ commit }, newCenter) {
  commit('setCenter', newCenter)
}

export const setZoomEnd = function ({ commit }, zoomEnd) {
  commit('setZoomEnd', zoomEnd)
}

export const setAllowPopupOnZoom = function ({ commit }, status) {
  commit('setAllowPopupOnZoom', status)
}

export const setSelectedMarker = function ({ commit }, marker) {
  commit('setSelectedMarker', marker)
}

export const setMap = function ({ commit }, map) {
  commit('setMap', map)
}

export const setPopupClicked = function ({ commit }, popupStatus) {
  commit('setPopupClicked', popupStatus)
}

export const setQueryDate = function ({ commit }, queryDate) {
  commit('setQueryDate', queryDate)
}

export const setQueryCategory = function ({ commit }, queryCategory) {
  commit('setQueryCategory', queryCategory)
}

export const setQueryTime = function ({ commit }, queryTime) {
  commit('setQueryTime', queryTime)
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
      Signs the user out
    */
export const signOut = function () {
  this.state.firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      this.signOut()
    })
    .catch(function (error) {
      console.log(error)
    })
}

/*
    Fetches new submissions from firebase storage and updates the local copy of all lost/found entries based on query
  */
export const updateCollectionQuery = function ({ commit }, queryAndPage) {
  const { query, page, filters } = queryAndPage
  const indexOptions = {
    query,
    page,
    attributesToRetrieve: [
      'type',
      'description',
      'date',
      'time',
      'contactEmail',
      'picture',
      'coordinates',
      'objectID',
      'category'
    ],
    hitsPerPage: 12
  }
  if (filters) {
    indexOptions.filters = filters
  }
  this.state.algoliaIndex.search(indexOptions, function searchDone (
    err,
    content
  ) {
    if (err) {
      return console.error(err)
    }
    // console.log('content :', content)
    commit('updateCollectionQuery', {
      hits: content.hits,
      nbPages: content.nbPages,
      nbHits: content.nbHits
    })
  })
}
