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

      <v-layout mt-2>
        <v-list-tile>
          <v-flex sm-6>
            <v-checkbox label="Lost"
              :disabled="!found"
              v-model="lost"></v-checkbox>
          </v-flex>
          <v-flex sm-6>
            <v-checkbox label="Found"
              :disabled="!lost"
              v-model="found"></v-checkbox>
          </v-flex>
        </v-list-tile>
      </v-layout>

      <!-- Categories -->
      <search-category></search-category>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
      lost: true,
      found: true
    }
  },
  methods: {
    ...mapActions([
      'setQueryStatus'
    ])
  },
  computed: {
    ...mapGetters([
      'stillLoading'
    ]),
    status () {
      return {
        lost: this.lost,
        found: this.found
      }
    }
  },
  watch: {
    status (status) {
      this.setQueryStatus(status)
    }
  }
}
</script>

<style>
#uniformFont {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>
