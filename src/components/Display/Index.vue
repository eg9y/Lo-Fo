<!-- This displays all the items in the database as a list view -->

<template>
  <div>
    <v-layout>
      <v-flex xs12
        sm6
        offset-sm3>
        <!-- Search bar to search submission by item type -->
        <search-panel></search-panel>
      </v-flex>
    </v-layout>
    <!--Sets the design and displays Lost Items-->
    <list :collectionCluster="clusteredCollections" />
    <h1 v-if="!clusteredCollections">
      Loading...
    </h1>
  </div>
</template>

<script>
import List from './List'
import SearchPanel from './SearchPanel'
import { mapGetters, mapActions } from 'vuex'

// Creates a reference to firebase storag

export default {
  components: {
    'list': List,
    'search-panel': SearchPanel
  },
  data () {
    return {
      clusteredCollections: null
    }
  },
  computed: {
    ...mapGetters([
      'queriedItems'
    ]),
    breakpoint () { return this.$vuetify.breakpoint }
  },
  methods: {
    ...mapActions([
      'updateCollectionQuery'
    ]),
    updateCluster (collection) {
      if (!collection || !collection.length) {
        this.clusteredCollections = []
      }
      let group = []
      let limit = 0
      let cluster = 0
      let clusters = []
      if (!this.breakpoint) {
        limit = 1
      } else {
        if (this.breakpoint.width < 500) {
          limit = 1
        } else if (this.breakpoint.width < 612) {
          limit = 2
        } else if (this.breakpoint.width < 885) {
          limit = 3
        } else {
          limit = 4
        }
      }
      collection.forEach((submission, index) => {
        group.push(submission)
        cluster++
        if (cluster === limit || collection.length - 1 === index) {
          clusters.push(group)
          group = []
          cluster = 0
        }
      })
      this.clusteredCollections = clusters
    }
  },
  watch: {
    breakpoint () {
      this.updateCluster([...this.queriedItems])
    },
    '$route.query.search': {
      immediate: true,
      async handler (query) {
        this.updateCollectionQuery(query)
        if (query) {
          this.updateCluster([this.queriedItems])
        }
      }
    },

    queriedItems (collection) {
      this.updateCluster([...this.queriedItems])
    }
  }
}
</script>

<style>
img {
  width: 100%;
  height: auto;
}
</style>
