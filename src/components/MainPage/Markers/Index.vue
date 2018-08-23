<template>
  <div>
    <individual-marker v-for="item in queriedFirestoreItems"
      v-if="filterToggle(item)"
      :key="item.id"
      :item="item">
    </individual-marker>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndividualMarker from './IndividualMarker'

export default {
  components: {
    IndividualMarker
  },
  computed: {
    ...mapGetters([
      'queriedFirestoreItems',
      'isUserLoggedIn',
      'user',
      'foundToggle',
      'lostToggle'
    ])
  },
  methods: {
    filterToggle (item) {
      return (this.foundToggle && item.collection === 'found') || (this.lostToggle && item.collection === 'lost')
    }
  }
}
</script>
