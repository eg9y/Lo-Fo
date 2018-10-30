<!-- User's profile page -->

<template>
  <v-container>
    <v-alert :value="alertTriggered"
      type="success"
      icon="icon-docs"
      transition="scale-transition">
      {{alertMessage}}
    </v-alert>
    <!-- User's personal information -->
    <v-layout>
      <v-flex xs12
        class="text-xs-center">
        <panel v-if="user"
          :title="user.displayName">
          <img class="img"
            justify-center
            :src="user.photoURL"
            alt="No pic">
          <h2>{{user.email}}</h2>
          <h2>{{user.phoneNumber}}</h2>
        </panel>
        <v-progress-circular indeterminate
          color="primary"
          v-else></v-progress-circular>
      </v-flex>
    </v-layout>

    <!-- User's submissions -->
    <v-layout>
      <v-flex>
        <v-layout :column="$vuetify.breakpoint.width < 710">
          <!-- Lost submissions -->
          <v-flex xs12
            mr-2>
            <panel title="My Reports">
              <template v-if="myMarkers && myMarkers.length > 0">
                <panel v-if="myMarkers.length > 0"
                  v-for="(item, index) in myMarkers"
                  :key="index"
                  :classes="['sm12']"
                  :title="`${item.collection}: ${ item.type }`">
                  <v-layout>
                    <v-flex sm8>
                      <div v-if="editing">
                        <b>Type:</b>
                        <v-text-field v-model="temporary.type"
                          solo></v-text-field>
                      </div>
                      <div>
                        <b>Description:</b>
                        <span v-if="!editing">{{ item.description }}</span>
                        <v-text-field v-else
                          v-model="temporary.description"
                          solo></v-text-field>
                      </div>
                      <div v-if="item.contactEmail">
                        <b>Contact:</b>
                        <span v-if="!editing">{{ item.contactEmail }}</span>
                        <v-text-field v-else
                          v-model="temporary.contactEmail"
                          solo></v-text-field>
                      </div>
                      <div v-else>
                        <b>Contact:</b> N/A
                      </div>
                      <div>
                        <b>Date:</b>
                        <span v-if="!editing">{{ item.date }}</span>
                        <v-text-field v-else
                          v-model="temporary.date"
                          solo></v-text-field>
                      </div>
                      <div>
                        <b>Time:</b>
                        <span v-if="!editing">{{ item.time }}</span>
                        <v-text-field v-else
                          v-model="temporary.time"
                          solo></v-text-field>
                      </div>
                    </v-flex>
                    <v-flex>
                      <v-btn @click="toggleEditing(item)"
                        v-if="!editing"
                        color="grey lighten-2">Edit</v-btn>
                      <template v-else>
                        <v-btn @click="submit"
                          color="green">Submit</v-btn>
                        <v-btn @click="clear"
                          color="red">Cancel</v-btn>
                      </template>
                      <br>
                      <br>
                      <v-btn color="green lighten-2"
                        :to="`/detail/${item.id}`">Go to detail link</v-btn>

                      <v-btn slot="activator"
                        v-clipboard:copy="`lostfound.ml/detail/${item.id}`"
                        v-clipboard:error="onError"
                        @click="triggerAlert('Copied!')"
                        flat
                        icon>
                        <v-icon color="grey">icon-docs</v-icon>
                      </v-btn>

                      <br>
                      <v-btn color="green lighten-2"
                        :to="`/${item.id}`">Go to map link</v-btn>
                      <v-btn color="grey"
                        v-clipboard:copy="`lostfound.ml/${item.id}`"
                        v-clipboard:error="onError"
                        @click="triggerAlert('Copied!')"
                        flat
                        icon>
                        <v-icon>icon-docs</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <br/>
                </panel>
              </template>
              <template v-else-if="!stillLoading">
                <h3>No submissions yet</h3>
              </template>
              <template v-else>
                <v-progress-circular indeterminate
                  color="primary"></v-progress-circular>
              </template>
            </panel>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      editing: false,
      temporary: {},
      alertTriggered: false,
      alertMessage: ''
    }
  },
  computed: {
    ...mapState([
      'db'
    ]),
    ...mapGetters([
      'isUserLoggedIn',
      'stillLoading',
      'user',
      'myMarkers'
    ])
  },
  methods: {
    ...mapActions([
      'getMyMarkers',
      'updateItem'
    ]),
    checkUserStatus () {
      if (this.stillLoading) {
        // Dont do anything
        return
      } else if (!this.user) {
        this.$router.push('/')
      }
      this.getMyMarkers()
    },
    triggerAlert (alertMessage) {
      this.alertTriggered = true
      this.alertMessage = alertMessage
      setTimeout(() => {
        this.alertTriggered = false
      }, 2000)
    },
    onError () {
      console.log('An error occured copying link!!!')
    },
    toggleEditing (item) {
      this.editing = !this.editing
      if (this.editing) {
        this.temporary = { ...item }
      }
    },
    submit () {
      this.db.collection('items').doc(this.temporary.id).set(this.temporary)
        .then(() => {
          this.updateItem(this.temporary)
          this.triggerAlert('Edited!')
          this.clear()
        })
    },
    clear () {
      this.temporary = {}
      this.editing = false
    }
  },
  // immediate: true -> run fetchAllDocuments immediately.
  // watch -> if user changes, then run fetchAllDocument again
  watch: {
    user: {
      handler: 'checkUserStatus',
      immediate: true
    }
  }
}
</script>

<style>
.img {
  width: 20%;
  height: 20%;
}
</style>
