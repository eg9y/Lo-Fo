<template>
  <div>
    <individual-marker v-for="foundItem in allFoundItems"
      :key="foundItem.id"
      :foundItem="foundItem">
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
      'allFoundItems',
      'isUserLoggedIn',
      'user'
    ])
  }
}
</script>
