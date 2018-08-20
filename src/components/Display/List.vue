
<!-- Displays a card list of collections -->

<template>
  <div>
    <v-layout v-for="(cluster, clusterIdx) in collectionCluster"
      :key="clusterIdx"
      class="mt-2 mr-2 ml-2">
      <v-flex v-for="(submission, index) in cluster"
        :key="index"
        v-if="submissionExists(submission)"
        :xs3="$vuetify.breakpoint.width >= 885"
        :xs4="$vuetify.breakpoint.width < 885"
        :xs6="$vuetify.breakpoint.width < 612"
        :xs12="$vuetify.breakpoint.width < 500">
        <v-layout column>
          <v-card :class="{'project-card':index !== cluster.length-1}">
            <v-card-media height="200px"
              :id="submission.id"
              v-if="submission.picture"
              :src="submission.picture"
              alt="NO IMAGE UPLOADED">
            </v-card-media>
            <v-card-media height="200px"
              :id="submission.id"
              v-else-if="submission.collection === 'lost'"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/768px-Icon-round-Question_mark.svg.png">
            </v-card-media>
            <v-card-media height="200px"
              :id="submission.id"
              v-else
              src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Exclamation_mark.png">
            </v-card-media>
            <v-card-title primary-title>
              <h2 class="text-sm-left">
                <strong>{{lostOrFound(submission.collection)}}</strong>
                <span v-html="displayAttribute (submission, 'type')">
                </span>
              </h2>
            </v-card-title>
            <v-card-title>
              <div>
                <div v-if="submission.description">
                  <b>Description:</b>
                  <span v-html="displayAttribute (submission, 'description')"></span>
                  <br/>
                </div>
                <div v-else>
                  <b>Description:</b> N/A<br/>
                </div>
                <br/>
                <div v-if="submission.contactEmail">
                  <b>Contact:</b>
                  <span v-html="displayAttribute (submission, 'contactEmail')"></span>
                  <br/>
                </div>
                <div v-else>
                  <b>Contact:</b> N/A<br/>
                </div>
                <br>
                <div v-if="submission.date">
                  <b>Date:</b>
                  <span v-html="displayAttribute (submission, 'date')"></span>
                  <br/>
                </div>
                <div v-else>
                  <b>Date:</b> N/A<br/>
                </div>
                <br>
                <div v-if="submission.time">
                  <b>Time:</b>
                  <span v-html="displayAttribute (submission, 'time')"></span>
                  <br/>
                </div>
                <div v-else>
                  <b>Time:</b> N/A<br/>
                </div>
              </div>
            </v-card-title>
            <v-card-actions>
              <!-- <v-btn bottom flat color="cyan">Contact</v-btn> -->
              <v-btn bottom
                flat
                color="cyan"
                @click="locateItem(submission)">Location</v-btn>
            </v-card-actions>
            <br/>
          </v-card>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['collectionCluster'],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'map'
    ])
  },
  methods: {
    ...mapActions([
      'setSelectedMarker',
      'setZoom',
      'setCenter'
    ]),
    collectionCode (value) {
      if (value === 'lost') {
        return 'l'
      } else {
        return 'f'
      }
    },
    displayAttribute (submission, attribute) {
      return submission._highlightResult[attribute]
        ? submission._highlightResult[attribute].value
        : submission[attribute]
    },
    /*
      Used in the Location button to redirect to the home page with the info window of the item open
    */
    locateItem (submission) {
      if (!submission) {
        return
      }
      const itemID = submission.id || submission.objectID
      const collectionType = this.collectionCode(submission.collection)
      this.setSelectedMarker(submission)
      this.setZoom(20)
      this.setCenter(L.latLng([submission.coordinates.lat, submission.coordinates.lng]))
      this.$router.push(`/${collectionType}-${itemID}`)
    },
    lostOrFound (collection) {
      if (collection === 'lost') {
        return 'Lost: '
      } else {
        return 'Found: '
      }
    },
    submissionExists (submission) {
      return submission &&
        submission.hasOwnProperty('description') &&
        submission.hasOwnProperty('type') &&
        submission.hasOwnProperty('date')
    }
  }
}
</script>

<style>
em {
  background-color: yellow;
}
.project-card {
  margin-right: 10px;
  padding: 0px;
}
.detail-info {
  font-size: 15px;
  margin: 0;
  padding: 0;
}
.small-info {
  font-size: 0.8em;
  overflow: hidden;
}
</style>
