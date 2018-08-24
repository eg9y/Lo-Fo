<template>
  <div v-if="selectedMarker">
    <panel :title="selectedMarker.type">
      <h2>
        Description: {{selectedMarker.description}}
      </h2>
      <h3>
        Category: {{selectedMarker.category}}
      </h3>
      <h3>
        Date: {{selectedMarker.date}}
      </h3>
      <h3>
        Time: {{selectedMarker.time}}
      </h3>
    </panel>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      item: ''
    }
  },
  computed: {
    ...mapGetters([
      'selectedMarker'
    ])
  },
  methods: {
    ...mapActions([
      'getMarkerById'
    ])
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      async handler (param) {
        console.log('param', param)
        this.getMarkerById(param)
      }
    }
  }
}
</script>

<style>
</style>
