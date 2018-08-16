export const stillLoading = function (state, loadingStatus) {
  state.stillLoading = loadingStatus
}

export const setAllLostItems = function (state, items) {
  state.allLostItems = items.map((item) => {
    item.coordinates = L.latLng(item.coordinates.lat, item.coordinates.lng)
    return item
  }) || items
}

export const setAllFoundItems = function (state, items) {
  state.allFoundItems = items.map((item) => {
    item.coordinates = L.latLng(item.coordinates.lat, item.coordinates.lng)
    return item
  }) || items
}

export const setQueriedLostItems = function (state, items) {
  state.queriedLostItems = items
}

export const setQueriedFoundItems = function (state, items) {
  state.queriedFoundItems = items
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

export const setSelectedLostMarker = function (state, marker) {
  state.selectedLostMarker = marker
}
