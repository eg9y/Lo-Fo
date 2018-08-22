<template>
  <v-navigation-drawer v-if="!stillLoading"
    clipped
    app
    dark
    id="uniformFont"
    fixed>
    <v-list dense>
      <!-- Date -->
      <date-picker></date-picker>

      <!-- Time -->
      <time-picker></time-picker>

      <!-- Categories -->
      <search-category></search-category>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import TimePicker from './TimePicker'
import DatePicker from './DatePicker'
import SearchCategory from './SearchCategory'

export default {
  components: {
    TimePicker,
    DatePicker,
    SearchCategory
  },
  data () {
    return {
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
