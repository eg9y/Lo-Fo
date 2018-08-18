<template>
  <div>
    <individual-marker v-for="lostItem in allLostItems"
      :key="lostItem.id"
      :lostItem="lostItem"
      >
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
      'allLostItems',
      'isUserLoggedIn',
      'user'
    ])
  }
}
</script>
