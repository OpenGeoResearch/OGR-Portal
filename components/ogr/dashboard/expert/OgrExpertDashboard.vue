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
        color="primary"
        elevation="4"
      >
        <v-toolbar-title>Experten-Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          elevation="0"
          :color="tab === 'overview' ? colors.green.lighten1 : 'primary'"
          @click="prepareComponent(ogrExpertDashboardOverview)"
        >
          Übersicht
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          elevation="0"
          :color="tab === 'inquired' ? colors.green.lighten1 : 'primary'"
          @click="prepareComponent(ogrExpertDashboardInquired)"
        >
          <v-badge
            color="accent"
            :value="dashboardData.open > 0"
            :content="dashboardData.open"
          >
            Angefragt
          </v-badge>
        </v-btn>

        <v-btn
          elevation="0"
          :color="tab === 'answered' ? colors.green.lighten1 : 'primary'"
          @click="prepareComponent(ogrExpertDashboardAnswered)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Beantwortet
          </v-badge>
        </v-btn>

        <v-btn
          elevation="0"
          :color="tab === 'rejected' ? colors.green.lighten1 : 'primary'"
          @click="prepareComponent(ogrExpertDashboardRejected)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Nicht beantwortet
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
      <v-row no-gutters align="center">
        <component
          :key="key"
          :is="containerComponent"
          :id="key"
          :actions="actions"
          :dashboard-data="dashboardData"
          :userData="userData"
        ></component>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import expertDashboardData from '@/apollo/queries/expertDashboardData.gql'
import user from '@/apollo/queries/user.gql'
import colors from '@/assets/colors'

export default {
  name: 'OgrExpertDashboard',
  data () {
    return {
      colors,
      ogrExpertDashboardOverview: {
        id: 'ogrExpertDashboardOverview',
        cmp: 'ogr-expert-dashboard-overview',
        tab: 'overview'
      },
      ogrExpertDashboardInquired: {
        id: 'ogrExpertDashboardInquired',
        cmp: 'ogr-expert-dashboard-tab',
        actions: [
          'ogr-expert-dashboard-action-answer',
          'ogr-expert-dashboard-action-reject'
        ],
        tab: 'inquired'
      },
      ogrExpertDashboardAnswered: {
        id: 'ogrExpertDashboardAnswered',
        cmp: 'ogr-expert-dashboard-tab',
        actions: [
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'answered'
      },
      ogrExpertDashboardRejected: {
        id: 'ogrExpertDashboardRejected',
        cmp: 'ogr-expert-dashboard-tab',
        actions: [
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'rejected'
      },
      containerComponent: 'ogr-expert-dashboard-overview',
      actions: [],
      key: undefined,
      dashboardData: {
        expertInquiryData: {
          open: 0,
          answered: 0,
          rejected: 0,
          inquired: 0
        },
        expertAnswerData: {
          answers: 0,
          votes: 0
        }
      },
      tab: '',
      userData: {}
    }
  },

  mounted () {
    this.getDashboardData()
    this.getUserData()
  },

  methods: {
    prepareComponent (component) {
      this.getDashboardData()
      this.containerComponent = component.cmp
      this.key = component.id
      this.actions = component.actions
      this.tab = component.tab
    },
    getDashboardData () {
      this.$apollo.query({
        query: expertDashboardData,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.dashboardData = response.data.expertDashboardData
      })
    },
    getUserData () {
      this.$apollo.query({
        query: user,
        variables: {
          username: this.$auth.user.username
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        if (response.data.user) {
          this.userData = response.data.user
          this.loaded = true
        }
      })
    }
  }
}
</script>
