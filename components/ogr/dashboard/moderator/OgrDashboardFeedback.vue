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
        :items="feedbacks"
        sort-by="created"
        class="elevation-1"
        single-expand
        show-expand
        :expanded.sync="expanded"
      >
        <template v-slot:top>
          <v-toolbar
              flat
          >
            <v-toolbar-title>Feedback</v-toolbar-title>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'OgrDashboardFeedback',
  data () {
    return {
      ogrApiUrl: this.$config.ogrApiUrl,
      item: undefined,
      expanded: [],
      headers: [
        { text: 'ID', align: 'start', value: 'id', sortable: false },
        { text: 'App/Portal', value: 'origin', sortable: false },
        { text: 'Feedback', value: 'text', sortable: false }
      ],
      dialog: {
        delete: false
      }
    }
  },

  apollo: {
    feedbacks: {
      query: gql`query Feedback {
                  feedbacks {
                    id
                    created
                    text
                    origin
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
  }
}
</script>

<style scoped>

</style>
