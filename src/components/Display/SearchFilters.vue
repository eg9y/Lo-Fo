<template>
  <v-navigation-drawer v-if="!stillLoading"
    clipped
    app
    id="uniformFont"
    fixed>
    <v-list dense>
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
      <v-list-tile>
        <v-menu ref="menu"
          :close-on-content-click="false"
          v-model="menu2"
          :nudge-right="40"
          :return-value.sync="time"
          lazy
          transition="scale-transition"
          offset-y
          full-width>
          <v-text-field slot="activator"
            v-model="time"
            label="Picker in menu"
            prepend-icon="access_time"
            readonly></v-text-field>
          <v-layout>
            <v-flex xs6>
              <v-time-picker v-if="menu2"
                v-model="time"
                @change="$refs.menu.save(time)"></v-time-picker>
            </v-flex>
            <v-flex xs6>
              <v-time-picker v-if="menu2"
                v-model="time2"
                @change="$refs.menu.save(time2)"></v-time-picker>
            </v-flex>
          </v-layout>
        </v-menu>
      </v-list-tile>

      <v-list-tile>
        <v-list-tile-action>
          <v-icon>icon-tag</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Categories</v-list-tile-title>
      </v-list-tile>
      <v-radio-group v-model="radioGroup">
        <v-list-tile v-for="category in categories"
          :key="category">
          <v-radio :label="category"
            :value="category"></v-radio>
        </v-list-tile>
        <v-list-tile>
          <v-radio label="other"
            :value="other"></v-radio>
        </v-list-tile>
      </v-radio-group>

      <v-list-tile>
        <v-list-tile-action>
          <v-icon>icon-tag</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Color</v-list-tile-title>
      </v-list-tile>
      <v-radio-group v-model="pickedColor">
        <v-list-tile v-for="color in colors"
          :key="color">
          <v-radio :label="color"
            :value="color"></v-radio>
        </v-list-tile>
      </v-radio-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      categories: [
        'bicycle',
        'laptop',
        'phone',
        'water bottle',
        'notebook', 'textbook', 'novel', 'headphones', 'soul', 'ID', 'wallet'],
      other: null,
      colors: [
        'black',
        'yellow'
      ],
      typeFilters: [],
      slider: 45,
      volume: 10,
      price: [110, 440],
      selected: [],
      time: null,
      time2: null,
      menu2: false,
      modal2: false
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
#uniformFont {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>
