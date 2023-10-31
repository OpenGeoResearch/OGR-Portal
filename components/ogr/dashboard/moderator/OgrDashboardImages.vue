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
        :items="images"
        sort-by="created"
        class="elevation-1"
        single-expand
        item-key="image.fileUUID"
        show-expand
        :expanded.sync="expanded"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Bilder</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.image.created="{ item }">
          {{ item.image.created | dateParse('YYYY-MM-DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
        </template>
        <template v-slot:item.image.url="{ item }">
          <v-img
            width="250px"
            :src="item.image.url + '?size=medium&token=' + item.image.token"
          ></v-img>
        </template>
        <template v-slot:item.image.sfw="{ item }">
          <span v-if="item.image.sfw===true">SICHER</span>
          <span v-else>NICHT SICHER</span>
        </template>
        <template v-slot:item.image.prediction_N="{ item }">
          N: {{ item.image.prediction_N.toFixed(3) }}<br>
          D: {{ item.image.prediction_D.toFixed(3) }}<br>
          S: {{ item.image.prediction_S.toFixed(3) }}<br>
          P: {{ item.image.prediction_P.toFixed(3) }}<br>
          H: {{ item.image.prediction_H.toFixed(3) }}<br>
          Faces: {{ item.image.faces }}
        </template>
        <template v-slot:item.question.datastream="{ item }">
          <span>{{ item.question.datastream ? item.question.datastream.name : '--' }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="mr-2"
            @click="approveImage(item)"
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
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-img
              width="1000px"
              :src="item.image.url + '?size=large&token=' + item.image.token"
            ></v-img>
          </td>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog.delete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Bild wirklich löchen?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog.delete = false">Abbrechen</v-btn>
            <v-btn color="primary" text @click="deleteImage()">Ja</v-btn>
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
  name: 'OgrDashboardImages',
  data () {
    return {
      ogrApiUrl: this.$config.ogrApiUrl,
      item: undefined,
      expanded: [],
      headers: [
        { text: 'ID', align: 'start', value: 'image.id', sortable: false },
        { text: 'Zeitstempel', value: 'image.created', sortable: false },
        { text: 'Vorschau', value: 'image.url', sortable: false },
        { text: 'Automatisch Erkannt', value: 'image.sfw' },
        { text: 'Bewertung', value: 'image.prediction_N', sortable: false },
        { text: 'Frage', value: 'question.datastream', sortable: false },
        { text: 'User', value: 'question.user.username', sortable: false },
        { text: 'Optionen', value: 'actions', sortable: false },
        { text: '', value: 'data-table-expand' }
      ],
      dialog: {
        delete: false,
        ban: false
      }
    }
  },

  apollo: {
    images: {
      query: gql`query ImageData {
                        images {
                            image {
                                id
                                fileUUID
                                questionUUID
                                url
                                created
                                sfw
                                token
                                prediction_N
                                prediction_D
                                prediction_S
                                prediction_P
                                prediction_H
                                faces
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
    approveImage (item) {
      this.$apollo.mutate({
        mutation: gql`mutation ($fileUUID: String!) {
                        approveImage(fileUUID: $fileUUID) {
                          image {
                                id
                                fileUUID
                                questionUUID
                                url
                                created
                                sfw
                                token
                                prediction_N
                                prediction_D
                                prediction_S
                                prediction_P
                                prediction_H
                                faces
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
          fileUUID: item.image.fileUUID
        },
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.images = response.data.approveImage
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
    deleteImage () {
      const item = this.item
      this.$apollo.mutate({
        mutation: gql`mutation ($fileUUID: String!) {
                      deleteImage(fileUUID: $fileUUID) {
                        image {
                                id
                                fileUUID
                                questionUUID
                                url
                                created
                                sfw
                                token
                                prediction_N
                                prediction_D
                                prediction_S
                                prediction_P
                                prediction_H
                                faces
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
          fileUUID: item.image.fileUUID
        },
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.images = response.data.deleteImage
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
                banUserImage(fileUUID: $fileUUID, username: $username) {
                  image {
                    id
                    fileUUID
                    questionUUID
                    url
                    created
                    sfw
                    token
                    prediction_N
                    prediction_D
                    prediction_S
                    prediction_P
                    prediction_H
                    faces
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
            fileUUID: item.image.fileUUID,
            username: item.question.user.username
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.images = response.data.banUserImage
        })
      }
      this.dialog.ban = false
    }
  }
}
</script>

<style scoped>

</style>
