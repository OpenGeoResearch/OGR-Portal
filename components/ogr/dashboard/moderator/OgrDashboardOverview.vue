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
  <v-row class="mt-2">
    <v-col>
      <v-alert
        class="pa-0"
        outlined
        color="primary"
      >
        <v-card-title>
          <v-icon
            large
            left
          >
            mdi-head-question
          </v-icon>
          <span class="text-h5 font-weight-light">Statistik: Fragen</span>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="7">
              <v-list-item class="text-h6 font-weight-light">Neue Fragen (letzte 24 Stunden):</v-list-item>
              <v-list-item class="text-h6 font-weight-light">Fragen insgesamt:</v-list-item>
            </v-col>
            <v-col>
              <v-list-item class="text-h6 font-weight-bold">{{ dashboardData.newQuestions }}</v-list-item>
              <v-list-item class="text-h6 font-weight-bold">{{ dashboardData.allQuestions }}</v-list-item>
            </v-col>
          </v-row>
        </v-card-text>
      </v-alert>
    </v-col>
    <v-col>
      <v-alert
        class="pa-0"
        outlined
        color="primary"
      >
        <v-card-title>
          <v-icon
            large
            left
          >
            mdi-image-search
          </v-icon>
          <span class="text-h5 font-weight-light">Statistik: Medien</span>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="7">
              <v-list-item class="text-h6 font-weight-light">Gesperrte Bilder:</v-list-item>
              <v-list-item class="mt-0 text-h6 font-weight-light">Gesperrte Videos:</v-list-item>
              <v-list-item class="text-h6 font-weight-light">Gesperrte Audios:</v-list-item>
            </v-col>
            <v-col>
              <v-list-item class="text-h6 font-weight-bold">{{ dashboardData.flaggedImages }}</v-list-item>
              <v-list-item class="text-h6 font-weight-bold">{{ dashboardData.flaggedVideos }}</v-list-item>
              <v-list-item class="text-h6 font-weight-bold">{{ dashboardData.flaggedAudios }}</v-list-item>
            </v-col>
          </v-row>
        </v-card-text>
      </v-alert>
    </v-col>
    <v-col>
      <v-alert
        class="pa-0"
        outlined
        color="primary"
      >
        <v-card-title>
          <v-icon
            large
            left
          >
            mdi-comment-account
          </v-icon>
          <span class="text-h5 font-weight-light">Statistik: User</span>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="7">
              <v-list-item class="text-h6 font-weight-light">Gemeldete Beiträge:</v-list-item>
              <v-list-item class="text-h6 font-weight-light">Feedback:</v-list-item>
            </v-col>
            <v-col>
              <v-list-item class="text-h6 font-weight-bold">-</v-list-item>
              <v-list-item class="text-h6 font-weight-bold">-</v-list-item>
            </v-col>
          </v-row>
        </v-card-text>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import dashboardData from '@/apollo/queries/dashboardData'

export default {
  name: 'OgrDashboardOverview',
  data () {
    return {
      dashboardData: {
        activeReports: null,
        indefiniteImages: null,
        indefiniteAudios: null,
        indefiniteVideos: null,
        flaggedImages: null,
        flaggedAudios: null,
        flaggedVideos: null,
        allQuestions: null,
        newQuestions: null,
        feedback: null
      }
    }
  },

  mounted () {
    this.getDashboardData()
  },

  methods: {
    getDashboardData () {
      this.$apollo.query({
        query: dashboardData,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.dashboardData = response.data.dashboardData
      })
    },
    closeDashboard () {
      this.$emit('closeFullscreen')
    }
  }
}
</script>

<style scoped>

</style>
