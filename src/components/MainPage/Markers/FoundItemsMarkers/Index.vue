<template>
  <div>
    <individual-marker
      v-for="foundItem in all_found_items"
      :key="foundItem.id"
      :foundItem="foundItem"
      :selectedFoundMarker="selectedFoundMarker"
    >
      <template slot="header">
        <h1 style="text-align: center;">Found: {{foundItem.type}}</h1>
        <progressive-img
          v-if="foundItem.picture"
          :src="foundItem.picture"
          :alt="foundItem.type"
        />
      </template>
      <template slot="body">
        <h3>{{foundItem.description}}</h3>
        <h3>{{foundItem.timestamp}}</h3>
        <h3>{{foundItem.contactEmail}}</h3>
      </template>
      <div class="text-xs-center">
        <v-btn
          v-if="isUserLoggedIn && user.uid == foundItem.userID"
          @click="emitDelete(foundItem)"
          color="error"
        >
          Resolve
          </v-btn>
      </div>
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
  props: ['selectedFoundMarker'],
  computed: {
    ...mapState([
      'all_found_items',
      'isUserLoggedIn',
      'user'
    ])
  },
  methods: {
    emitDelete (foundItem) {
      this.$emit('deleteMarker', [foundItem.pictures, foundItem.id, foundItem.userID, 'found-items'])
    }
  }
}
</script>
