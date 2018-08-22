<template>
  <v-list-tile>
    <v-menu ref="menu"
      :close-on-content-click="false"
      v-model="menu"
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y
      full-width>
      <v-text-field slot="activator"
        :value="startToEndTime"
        prepend-icon="icon-clock"
        readonly></v-text-field>
      <v-layout>
        <v-flex>
          <v-time-picker v-if="menu"
            color="yellow darken-1"
            dark
            v-model="timeStart"
            :width="200"></v-time-picker>
        </v-flex>
        <v-flex>
          <v-time-picker v-if="menu"
            color="yellow darken-2"
            dark
            v-model="timeEnd"
            :width="200"></v-time-picker>
        </v-flex>
      </v-layout>
    </v-menu>
  </v-list-tile>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      timeStart: '0:00',
      timeEnd: '23:59',
      menu: false
    }
  },
  methods: {
    ...mapActions([
      'setQueryTime'
    ])
  },
  computed: {
    startToEndTime () {
      return this.timeStart + ' - ' + this.timeEnd
    }
  },
  watch: {
    startToEndTime () {
      this.setQueryTime({
        timeStart: this.timeStart.replace(':', ''),
        timeEnd: this.timeEnd.replace(':', '')
      })
    }
  }
}
</script>

<style>
</style>
