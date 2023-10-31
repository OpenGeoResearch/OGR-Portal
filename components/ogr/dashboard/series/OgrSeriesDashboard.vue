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
    color="#ececec"
  >
    <v-container
      class="pa-0 ma-0"
      fluid
    >
      <v-app-bar
        height="64"
        dark
        color="secondary"
        elevation="4"
      >
        <v-toolbar-title>Serien-Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          elevation="0"
          :color="tab === 'overview' ? colors.lightGreen.lighten1 : 'secondary'"
          @click="prepareComponent(ogrSeriesDashboardOverview)"
        >
          Übersicht
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          elevation="0"
          :color="tab === 'new' ? colors.lightGreen.lighten1 : 'secondary'"
          @click="prepareComponent(ogrSeriesDashboardNewSeries)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Neue Serie erstellen
          </v-badge>
        </v-btn>

        <v-btn
          elevation="0"
          :color="tab === 'my' ? colors.lightGreen.lighten1 : 'secondary'"
          @click="prepareComponent(ogrSeriesDashboardMySeries)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Meine Serien verwalten
          </v-badge>
        </v-btn>

        <v-btn
          elevation="0"
          :color="tab === 'all' ? colors.lightGreen.lighten1 : 'secondary'"
          @click="prepareComponent(ogrSeriesDashboardAllSeries)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Alle Serien anzeigen
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
        ></component>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import colors from '@/assets/colors'

export default {
  name: 'OgrSeriesDashboard',
  data () {
    return {
      colors,
      ogrSeriesDashboardOverview: {
        id: 'ogrSeriesDashboardOverview',
        cmp: 'ogr-series-dashboard-overview',
        tab: 'overview'
      },
      ogrSeriesDashboardNewSeries: {
        id: 'ogrSeriesDashboardNewSeries',
        cmp: 'ogr-series-dashboard-new-series',
        tab: 'new'
      },
      ogrSeriesDashboardMySeries: {
        id: 'ogrSeriesDashboardMySeries',
        cmp: 'ogr-series-dashboard-my-series',
        tab: 'my'
      },
      ogrSeriesDashboardAllSeries: {
        id: 'ogrSeriesDashboardAllSeries',
        cmp: 'ogr-series-dashboard-all-series',
        tab: 'all'
      },
      containerComponent: 'ogr-series-dashboard-overview',
      key: undefined,
      tab: ''
    }
  },

  mounted () {
  },

  methods: {
    prepareComponent (component) {
      this.containerComponent = component.cmp
      this.key = component.id
      this.tab = component.tab
    }
  }
}
</script>
