<template>
  <v-navigation-drawer v-if="!stillLoading"
    clipped
    app
    fixed>
    <v-list dense>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>icon-tag</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Dashboard</v-list-tile-title>
          <v-combobox v-model="typeFilters"
            :items="categories"
            required
            label="Categories"
            multiple
            chips></v-combobox>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>icon-calendar-1</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Date</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-layout>
            <v-icon left>icon-clock</v-icon>
          </v-layout>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>time</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      categories: ['water bottle', 'bicycle'],
      typeFilters: [],
      slider: 45,
      volume: 10,
      price: [110, 440]
    }
  },
  computed: {
    ...mapGetters([
      'stillLoading'
    ])
  }
}
</script>

<style>
</style>
