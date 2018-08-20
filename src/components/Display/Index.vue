<!-- This displays all the items in the database as a list view -->

<template>
  <v-container fluid
    grid-list-md>
    <search-filters></search-filters>
    <v-layout>
      <v-flex d-flex
        xs12
        sm6
        md6
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
    <v-layout>
      <div v-if="nbPages > 1"
        class="text-xs-center">
        <v-pagination v-model="page"
          :length="nbPages"
          prev-icon="icon-left-open"
          next-icon="icon-right-open"></v-pagination>
      </div>
    </v-layout>
    <div id="powered-by-algolia">
      <p>Powered by</p>
      <img src="../../../static/svg/algolia.svg"
        width="24"
        height="24"
        alt="">
    </div>
  </v-container>
</template>

<script>
import List from './List'
import SearchPanel from './SearchPanel'
import SearchFilters from './SearchFilters'
import { mapGetters, mapActions } from 'vuex'

// Creates a reference to firebase storag

export default {
  components: {
    List,
    SearchPanel,
    SearchFilters
  },
  data () {
    return {
      clusteredCollections: null,
      page: 0,
      filters: null
    }
  },
  computed: {
    ...mapGetters([
      'queriedItems',
      'nbHits',
      'nbPages'
    ]),
    breakpoint () { return this.$vuetify.breakpoint },
    pageZeroIndexed () {
      if (this.page === 0) {
        return 0
      }
      return this.page - 1
    }
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
        this.updateCollectionQuery({ query, page: this.pageZeroIndexed, filters: this.filters })
      }
    },
    queriedItems (collection) {
      this.updateCluster([...this.queriedItems])
    },
    page () {
      const query = this.$route.query.search
      this.updateCollectionQuery({ query, page: this.pageZeroIndexed, filters: this.filters })
    },
    filter () {
      const query = this.$route.query.search
      this.updateCollectionQuery({ query, page: this.pageZeroIndexed, filters: this.filters })
    }
  }
}
</script>
<style scoped>
p {
  display: inline-block;
  font-weight: 600;
}
img {
  margin-top: 10px;
}
#powered-by-algolia {
  text-align: center;
}
</style>
