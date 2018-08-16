<template>
  <div>
    <individual-marker v-for="lostItem in allLostItems"
      :key="lostItem.id"
      :lostItem="lostItem"
      >
      <template slot="header">
        <h1 style="text-align: center;">Lost: {{lostItem.type}}</h1>
        <progressive-img v-if="lostItem.picture"
          :src="lostItem.picture"
          :alt="lostItem.type" />
      </template>
      <template slot="body">
        <h3>{{lostItem.description}}</h3>
        <h3>{{lostItem.timestamp}}</h3>
        <h3>{{lostItem.contactEmail}}</h3>
      </template>
      <template slot="interaction">
        <div class="text-xs-center">
          <v-btn v-if="isUserLoggedIn && user.uid == lostItem.userID"
            @click="emitDelete(lostItem)"
            color="error">
            Resolve
          </v-btn>
        </div>
      </template>
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
  },
  methods: {
    emitDelete (lostItem) {
      this.$emit('deleteMarker', [lostItem.pictures, lostItem.id, lostItem.userID, 'found-items'])
    }
  }
}
</script>
