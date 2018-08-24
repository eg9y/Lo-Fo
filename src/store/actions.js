import { pushDocuments } from './helperFunction'

export const stillLoading = function ({ commit }, loadingStatus) {
  commit('stillLoading', loadingStatus)
}

export const toggleMapStillLoading = function ({ commit }, loadingStatus) {
  commit('toggleMapStillLoading', loadingStatus)
}

export const setQueriedFirestoreItems = function ({ commit }, items) {
  commit('setQueriedFirestoreItems', items)
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

export const setQueryStatus = function ({ commit }, queryStatus) {
  commit('setQueryStatus', queryStatus)
}

export const setFromSideNav = function ({ commit }, fromSideNav) {
  commit('setFromSideNav', fromSideNav)
}

/*
    Fetches new submissions from firebase storage and updates the local copy of all lost/found entries
  */
export const updateCollection = function ({ commit }) {
  let documents = []
  this.state.db
    .collection('items')
    .orderBy('type')
    .limit(this.state.itemPerPageFirestore)
    .get()
    .then(items => {
      pushDocuments(items, documents)
      commit('setQueriedFirestoreItems', documents)
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error)
    })
}

/*
    Fetches new submissions from firebase storage and updates the local copy of all lost/found entries
  */
export const getMarkerById = function ({ commit }, id) {
  this.state.db
    .collection('items')
    .doc(id)
    .get()
    .then(item => {
      commit('setSelectedMarker', item.data())
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error)
    })
}

export const queryFirestoreItemsNext = function ({ commit }) {
  // Get the last visible document
  /* eslint-disable */
  const lastVisible = this.state.queriedFirestoreItems[
    this.state.queriedFirestoreItems.length - 1
  ].type

  // Construct a new query starting at this document,
  // get the next 25 cities.
  let documents = []
  commit('setPage', this.state.queriedFirestoreItems[0].type)
  this.state.db
    .collection('items')
    .orderBy('type')
    .startAfter(lastVisible)
    .limit(this.state.itemPerPageFirestore)
    .get()
    .then(items => {
      pushDocuments(items, documents)
      commit('setQueriedFirestoreItems', documents)
    })
}

export const queryFirestoreItemsPrev = function({ commit }) {
  if (this.state.page.length === 0) {
    return
  }
  let documents = []
  this.state.db
    .collection('items')
    .orderBy('type')
    .startAt(this.state.page[this.state.page.length - 1])
    .limit(this.state.itemPerPageFirestore)
    .get()
    .then(items => {
      pushDocuments(items, documents)
      commit('setPage', null)
      commit('setQueriedFirestoreItems', documents)
    })
}

/*
      Signs the user out
    */
export const signOut = function() {
  this.state.firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      this.signOut()
    })
    .catch(function(error) {
      console.log(error)
    })
}

/*
    Fetches new submissions from firebase storage and updates the local copy of all lost/found entries based on query
  */
export const updateCollectionQuery = function({ commit }, queryAndPage) {
  const { query, page, filters, attributes, hits } = queryAndPage
  let hitsPerPage = 20
  if (hits) {
    hitsPerPage = hits
  }
  let attributesToRetrieve = [
    'type',
    'description',
    'date',
    'time',
    'contactEmail',
    'picture',
    'coordinates',
    'objectID',
    'category'
  ]
  if (attributes) {
    attributesToRetrieve = attributes
  }
  const indexOptions = {
    query,
    page,
    attributesToRetrieve,
    hitsPerPage
  }
  if (filters) {
    indexOptions.filters = filters
  }
  this.state.algoliaIndex.search(indexOptions, function searchDone(
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

export const updateItem = function({ commit }, item) {
  const newItem = item
  newItem.objectID = newItem.id
  delete newItem.id
  this.state.algoliaIndex.saveObject(newItem, function(err, content) {
    if (err) throw err
    console.log(content)
  })
}
