<template>
  <v-list-tile>
    <v-menu ref="menu"
      :close-on-content-click="false"
      v-model="menu"
      :nudge-right="40"
      :return-value.sync="date"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px">
      <v-text-field slot="activator"
        v-model="date"
        label="Date"
        prepend-icon="icon-calendar-1"
        readonly></v-text-field>
      <v-date-picker v-model="date"
        @input="$refs.menu.save(date)"
        :allowed-dates="allowedDates"
        no-title
        dark
        scrollable>

      </v-date-picker>
    </v-menu>
  </v-list-tile>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      date: null,
      currentDate: null,
      menu: false
    }
  },
  methods: {
    ...mapActions([
      'setQueryDate'
    ]),
    allowedDates (evaluatedDate) {
      const [year, month, date] = evaluatedDate.split('-')
      const sameYear = parseInt(year) === parseInt(this.currentDate.year)
      const lessThanMonth = month < this.currentDate.month
      const equalMonth = month === this.currentDate.month
      const lessThanOrEqualDate = date <= this.currentDate.date
      if (sameYear && (lessThanMonth || (equalMonth && lessThanOrEqualDate))) {
        return true
      }
    }
  },
  watch: {
    date (evaluatedDate) {
      const [year, month, date] = evaluatedDate.split('-')
      this.setQueryDate(month + '/' + date + '/' + year)
    }
  },
  created () {
    const currentDate = new Date()
    let month = (currentDate.getMonth() + 1).toString()
    let date = currentDate.getDate()
    if (month.length === 1) {
      month = '0' + month
    }
    if (date.length === 1) {
      date = '0' + date
    }
    this.currentDate = {
      year: currentDate.getFullYear(),
      month,
      date
    }
    // this.date = this.currentDate.year + '-' + this.currentDate.month + '-' + this.currentDate.date
  }
}
</script>

<style>
</style>
