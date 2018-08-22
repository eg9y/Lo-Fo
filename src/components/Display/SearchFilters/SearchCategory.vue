<template>
  <div>
    <v-list-tile>
      <v-list-tile-action>
        <v-icon>icon-tag</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>Categories</v-list-tile-title>
    </v-list-tile>
    <v-radio-group v-model="selection">
      <v-list-tile>
        <v-radio label="all"
          :value="all"></v-radio>
      </v-list-tile>
      <v-list-tile v-for="category in categories"
        :key="category">
        <v-radio :label="category"
          :value="category"></v-radio>
      </v-list-tile>
    </v-radio-group>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      selection: null,
      all: null
    }
  },
  methods: {
    ...mapActions([
      'setQueryCategory'
    ])
  },
  watch: {
    selection (selection) {
      if (selection === 'all') {
        return this.setQueryCategory(null)
      }
      this.setQueryCategory(selection)
    }
  }
}
</script>

<style>
</style>
