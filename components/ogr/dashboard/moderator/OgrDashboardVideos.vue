<!--
    Copyright (C) 2023 Geodätisches Institut RWTH Aachen University,
    Mies-van-der-Rohe-Straße 1, D 52074 Aachen, Germany.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
  <v-row no-gutters>
    <v-col
      cols="12"
    >
      <v-data-table
        :headers="headers"
        :items="videos"
        sort-by="created"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Videos</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.video.created="{ item }">
          {{ item.video.created | dateParse('YYYY-MM-DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
        </template>
        <template v-slot:item.video.url="{ item }">
          <video
            :src="item.video.url + '?token=' + item.video.token"
            width="250px"
            controls
            playsInline
          >
            Your browser does not support the <code>video</code> element.
          </video>
        </template>
        <template v-slot:item.question.datastream.name="{ item }">
          <span>{{ item.question.datastream.name }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="mr-2"
            @click="approveVideo(item)"
          >
            mdi-check
          </v-icon>
          <v-icon
            @click="deleteDialog(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon
            v-if="item.question.user !== null"
            @click="banDialog(item)"
          >
            mdi-account-cancel
          </v-icon>
          <v-btn
            :href="goTo(item)"
            target="_blank"
            icon
          >
            <v-icon
            >
              mdi-open-in-new
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog.delete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Video wirklich löchen?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog.delete = false">Abbrechen</v-btn>
            <v-btn color="primary" text @click="deleteVideo()">Ja</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog.ban" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">User wirklich sperren?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog.ban = false">Abbrechen</v-btn>
            <v-btn color="primary" text @click="banUser()">Ja</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'OgrDashboardVideos',
  data () {
    return {
      ogrApiUrl: this.$config.ogrApiUrl,
      item: undefined,
      expanded: [],
      headers: [
        { text: 'ID', align: 'start', value: 'video.id', sortable: false },
        { text: 'Zeitstempel', value: 'video.created', sortable: false },
        { text: 'Vorschau', value: 'video.url', sortable: false },
        { text: 'Frage', value: 'question.datastream.name', sortable: false },
        { text: 'User', value: 'question.user.username', sortable: false },
        { text: 'Optionen', value: 'actions', sortable: false }
      ],
      dialog: {
        delete: false,
        ban: false
      }
    }
  },

  apollo: {
    videos: {
      query: gql`query File {
                  videos {
                    video {
                        id
                        fileUUID
                        questionUUID
                        url
                        created
                        token
                    }
                    question {
                        datastream {
                            id
                            name
                        }
                        user {
                            id
                            username
                        }
                    }
                  }
              }`,
      fetchPolicy: 'no-cache',
      prefetch: true,
      skip () {
        return !this.$auth.loggedIn
      },
      context () {
        return {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }
    }
  },

  methods: {
    approveVideo (item) {
      this.$apollo.mutate({
        mutation: gql`mutation ($fileUUID: String!) {
                        approveVideo(fileUUID: $fileUUID) {
                          video {
                        id
                        fileUUID
                        questionUUID
                        url
                        created
                        token
                    }
                    question {
                        datastream {
                            id
                            name
                        }
                        user {
                            id
                            username
                        }
                    }
                        }
                      }`,
        variables: {
          fileUUID: item.video.fileUUID
        },
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.videos = response.data.approveVideo
      })
    },
    deleteDialog (item) {
      this.item = item
      this.dialog.delete = true
    },
    banDialog (item) {
      this.item = item
      this.dialog.ban = true
    },
    deleteVideo () {
      const item = this.item
      this.$apollo.mutate({
        mutation: gql`mutation ($fileUUID: String!) {
                      deleteVideo(fileUUID: $fileUUID) {
                        video {
                        id
                        fileUUID
                        questionUUID
                        url
                        created
                        token
                    }
                    question {
                        datastream {
                            id
                            name
                        }
                        user {
                            id
                            username
                        }
                    }
                      }
                    }`,
        variables: {
          fileUUID: item.video.fileUUID
        },
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.videos = response.data.deleteVideo
      })
      this.dialog.delete = false
    },
    goTo (item) {
      return '/question/' + item.question.datastream.id
    },
    banUser () {
      const item = this.item
      if (item.question.user !== null) {
        this.$apollo.mutate({
          mutation: gql`mutation ($fileUUID: String!, $username: String!) {
                banUserVideo(fileUUID: $fileUUID, username: $username) {
                  video {
                    id
                    fileUUID
                    questionUUID
                    url
                    created
                    token
                  }
                  question {
                    datastream {
                      id
                      name
                    }
                    user {
                      id
                      username
                    }
                  }
                }
              }`,
          variables: {
            fileUUID: item.video.fileUUID,
            username: item.question.user.username
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.videos = response.data.banUserVideo
        })
      }
      this.dialog.ban = false
    }
  }
}
</script>

<style scoped>

</style>
