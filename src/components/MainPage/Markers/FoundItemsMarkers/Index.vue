<template>
  <div>
    <individual-marker v-for="foundItem in all_found_items"
                       :key="foundItem.id" :foundItem="foundItem" :selectedMarker="selectedMarker">
    </individual-marker>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import IndividualMarker from './IndividualMarker'

export default {
  components: {
    IndividualMarker
  },
  props: ['selectedMarker'],
  computed: {
    ...mapState([
      'all_found_items'
    ])
  }
}
</script>

<style>
</style>
