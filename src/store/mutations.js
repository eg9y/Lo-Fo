export const stillLoading = function (state, loadingStatus) {
  state.stillLoading = loadingStatus
}

export const toggleMapStillLoading = function (state, loadingStatus) {
  state.mapStillLoading = loadingStatus
}

export const setAllLostItems = function (state, items) {
  state.allLostItems =
    items.map(item => {
      item.coordinates = L.latLng(item.coordinates.lat, item.coordinates.lng)
      return item
    }) || items
}

export const setAllFoundItems = function (state, items) {
  state.allFoundItems =
    items.map(item => {
      item.coordinates = L.latLng(item.coordinates.lat, item.coordinates.lng)
      return item
    }) || items
}

export const updateCollectionQuery = function (state, contentResult) {
  state.queriedItems = contentResult.hits
  state.nbHits = contentResult.nbHits
  state.nbPages = contentResult.nbPages
}

// below four functions are for toggling lost/found pins
export const setLostToggle = function (state, status) {
  state.lostToggle = status
}

export const setFoundToggle = function (state, status) {
  state.foundToggle = status
}

export const setCenter = function (state, newCenter) {
  state.center = newCenter
}

export const setZoom = function (state, newZoom) {
  state.zoom = newZoom
}

export const toggleCluster = function (state, toggle) {
  state.clusterOn = toggle
}

export const setZoomEnd = function (state, zoomEnd) {
  state.zoomEnd = zoomEnd
}

export const setSelectedMarker = function (state, marker) {
  state.selectedMarker = marker
}

export const setMap = function (state, map) {
  state.map = map
}

export const setPopupClicked = function (state, popupStatus) {
  state.popupClicked = popupStatus
}
