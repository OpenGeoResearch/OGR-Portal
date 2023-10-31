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
  <v-sheet
    width="100%"
    height="100%"
    color="white"
  >
    <v-container
      class="pa-0 ma-0"
      fluid
    >
      <v-app-bar
        dark
        color="info"
        elevation="4"
      >
        <v-toolbar-title>Moderatoren-Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="prepareComponent(orgDashboardOverview)"
        >
          Übersicht
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="prepareComponent(ogrDashboardImages)"
        >
          <v-badge
            color="accent"
            :value="dashboardData.indefiniteImages > 0"
            :content="dashboardData.indefiniteImages"
          >
          Bilder
          </v-badge>
        </v-btn>
        <v-btn
          text
          @click="prepareComponent(ogrDashboardAudios)"
        >
          <v-badge
            color="accent"
            :value="dashboardData.indefiniteAudios > 0"
            :content="dashboardData.indefiniteAudios"
          >
            Audios
          </v-badge>
        </v-btn>
        <v-btn
          text
          @click="prepareComponent(ogrDashboardVideos)"
        >
          <v-badge
            color="accent"
            :value="dashboardData.indefiniteVideos > 0"
            :content="dashboardData.indefiniteVideos"
          >
            Videos
          </v-badge>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="prepareComponent(ogrDashboardReports)"
        >
          <v-badge
            color="accent"
            :value="dashboardData.activeReports > 0"
            :content="dashboardData.activeReports"
          >
            Gemeldete Beiträge
          </v-badge>
        </v-btn>
        <v-btn
          text
          @click="prepareComponent(ogrDashboardFeedback)"
        >
          <v-badge
            color="primary"
            :value="dashboardData.feedback > 0"
            :content="dashboardData.feedback"
          >
            Feedback
          </v-badge>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          icon
          to="/"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-row no-gutters>
        <component :is="containerComponent"></component>
      </v-row>
      </v-container>
  </v-sheet>
</template>

<script>
import dashboardData from '~/apollo/queries/dashboardData.gql'

export default {
  name: 'OgrModDashboard',
  data () {
    return {
      orgDashboardOverview: {
        id: 'orgDashboardOverview',
        active: true,
        cmp: 'ogr-dashboard-overview'
      },
      ogrDashboardReports: {
        id: 'ogrDashboardReports',
        active: true,
        cmp: 'ogr-dashboard-reports'
      },
      ogrDashboardImages: {
        id: 'ogrDashboardImages',
        active: true,
        cmp: 'ogr-dashboard-images'
      },
      ogrDashboardAudios: {
        id: 'ogrDashboardAudios',
        active: true,
        cmp: 'ogr-dashboard-audios'
      },
      ogrDashboardVideos: {
        id: 'ogrDashboardVideos',
        active: true,
        cmp: 'ogr-dashboard-videos'
      },
      ogrDashboardFeedback: {
        id: 'ogrDashboardFeedback',
        active: true,
        cmp: 'ogr-dashboard-feedback'
      },
      containerComponent: 'ogr-dashboard-overview',
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
    prepareComponent (component) {
      if (component.cmp === 'ogr-dashboard-overview') {
        this.getDashboardData()
      }
      this.containerComponent = component.cmp
    },
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
