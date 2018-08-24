<template>
  <l-marker :lat-lng="item.coordinates"
    :icon="$options.icon(item.collection)"
    :ref="`f${item.id}`"
    :riseOnHover="true"
    @click="setMarker">
  </l-marker>
</template>

<script>
import { LMarker, LPopup } from 'vue2-leaflet'
import { mapActions } from 'vuex'

export default {
  icon (collection) {
    let url = 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/found_marker.png?alt=media&token=819906a9-f325-49d3-826f-2800588d8277'
    if (collection === 'lost') {
      url = 'https://firebasestorage.googleapis.com/v0/b/lost-and-found-ddb76.appspot.com/o/lost_marker.png?alt=media&token=a84b3255-0d57-4ec3-9969-06242ba745ef'
    }
    return L.icon({
      iconUrl: url,
      iconSize: [24, 24],
      iconAnchor: [20, 20]
    })
  },
  props: ['item'],
  components: {
    LMarker,
    LPopup
  },
  data () {
    return {
      marker: null
    }
  },
  methods: {
    ...mapActions([
      'setSelectedMarker',
      'setPopupClicked'
    ]),
    setMarker () {
      this.setPopupClicked(true)
      this.setSelectedMarker(this.item)
    }
  }
}
</script>
