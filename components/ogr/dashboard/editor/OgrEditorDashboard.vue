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
        color="error"
        elevation="4"
      >
        <v-toolbar-title>Editoren-Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          elevation="0"
          :color="tab === 'overview' ? colors.purple.lighten1 : 'error'"
          @click="prepareComponent(ogrEditorDashboardOverview)"
        >
          Übersicht
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          elevation="0"
          :color="tab === 'all' ? colors.purple.lighten1 : 'error'"
          @click="prepareComponent(ogrEditorDashboardAll)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Alle
          </v-badge>
        </v-btn>
        <v-btn
          elevation="0"
          :color="tab === 'new' ? colors.purple.lighten1 : 'error'"
          @click="prepareComponent(ogrEditorDashboardNew)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Unbearbeitet
          </v-badge>
        </v-btn>
        <v-btn
          elevation="0"
          :color="tab === 'interesting' ? colors.purple.lighten1 : 'error'"
          @click="prepareComponent(ogrEditorDashboardInteresting)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Interessant
          </v-badge>
        </v-btn>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              elevation="0"
              :color="tab === 'pending' ? colors.purple.lighten1 : 'error'"
              v-bind="attrs"
              v-on="on"
            >
              <v-badge
                color="accent"
                :value="false"
                :content="0"
              >
                Antwort Ausstehend
              </v-badge>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title @click="prepareComponent(ogrEditorDashboardAnswerPendingFirst)">Erste Runde</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="prepareComponent(ogrEditorDashboardAnswerPendingSecond)">Zweite Runde</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          elevation="0"
          :color="tab === 'received' ? colors.purple.lighten1 : 'error'"
          @click="prepareComponent(ogrEditorDashboardAnswerReceived)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Antwort Erhalten
          </v-badge>
        </v-btn>
        <v-btn
          elevation="0"
          :color="tab === 'review' ? colors.purple.lighten1 : 'error'"
          @click="prepareComponent(ogrEditorDashboardNeedsReview)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Review
          </v-badge>
        </v-btn>
        <v-btn
          elevation="0"
          :color="tab === 'closed' ? colors.purple.lighten1 : 'error'"
          @click="prepareComponent(ogrEditorDashboardClosed)"
        >
          <v-badge
            color="accent"
            :value="false"
            :content="0"
          >
            Geschlossen
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
        <component
          :key="key"
          :is="containerComponent"
          :id="key"
          :includedTags="includedTags"
          :excludedTags="excludedTags"
          :actions="actions"
        ></component>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import colors from '@/assets/colors'

export default {
  name: 'OgrEditorDashboard',
  data () {
    return {
      colors,
      ogrEditorDashboardOverview: {
        id: 'ogrEditorDashboardOverview',
        cmp: 'ogr-editor-dashboard-overview',
        tab: 'overview'
      },
      ogrEditorDashboardAll: {
        id: 'ogrEditorDashboardAll',
        cmp: 'ogr-editor-dashboard-tab',
        includedTags: [],
        excludedTags: [],
        actions: [
          'ogr-editor-dashboard-action-inquire-first',
          'ogr-editor-dashboard-action-interesting',
          'ogr-editor-dashboard-action-review',
          'ogr-editor-dashboard-action-close',
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'all'
      },
      ogrEditorDashboardNew: {
        id: 'ogrEditorDashboardNew',
        cmp: 'ogr-editor-dashboard-tab',
        includedTags: ['unanswered-exp'],
        excludedTags: ['handled'],
        actions: [
          'ogr-editor-dashboard-action-inquire-first',
          'ogr-editor-dashboard-action-interesting',
          'ogr-editor-dashboard-action-review',
          'ogr-editor-dashboard-action-close',
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'new'
      },
      ogrEditorDashboardInteresting: {
        id: 'ogrEditorDashboardInteresting',
        cmp: 'ogr-editor-dashboard-tab',
        includedTags: ['potential'],
        excludedTags: ['closed'],
        actions: [
          'ogr-editor-dashboard-action-inquire-first',
          'ogr-editor-dashboard-action-interesting',
          'ogr-editor-dashboard-action-review',
          'ogr-editor-dashboard-action-close',
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'interesting'
      },
      ogrEditorDashboardAnswerPendingFirst: {
        id: 'ogrEditorDashboardAnswerPendingFirst',
        cmp: 'ogr-editor-dashboard-tab',
        includedTags: ['exp-inquired-first', 'exp-inquired'],
        excludedTags: ['closed', 'needs-review', 'exp-inquired-second', 'answer-received'],
        actions: [
          'ogr-editor-dashboard-action-inquire-second',
          'ogr-editor-dashboard-action-review',
          'ogr-editor-dashboard-action-close',
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'pending'
      },
      ogrEditorDashboardAnswerPendingSecond: {
        id: 'ogrEditorDashboardAnswerPendingSecond',
        cmp: 'ogr-editor-dashboard-tab',
        includedTags: ['exp-inquired-second'],
        excludedTags: ['closed', 'needs-review', 'answer-received'],
        actions: [
          'ogr-editor-dashboard-action-ask-community',
          'ogr-editor-dashboard-action-review',
          'ogr-editor-dashboard-action-close',
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'pending'
      },
      ogrEditorDashboardAnswerReceived: {
        id: 'ogrEditorDashboardAnswerReceived',
        cmp: 'ogr-editor-dashboard-tab',
        includedTags: ['answer-received'],
        excludedTags: ['closed', 'needs-review'],
        actions: [
          'ogr-editor-dashboard-action-review',
          'ogr-editor-dashboard-action-close',
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'received'
      },
      ogrEditorDashboardNeedsReview: {
        id: 'ogrEditorDashboardNeedsReview',
        cmp: 'ogr-editor-dashboard-tab',
        includedTags: ['needs-review'],
        excludedTags: ['closed'],
        actions: [
          'ogr-editor-dashboard-action-close',
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'review'
      },
      ogrEditorDashboardClosed: {
        id: 'ogrEditorDashboardClosed',
        cmp: 'ogr-editor-dashboard-tab',
        includedTags: ['closed'],
        excludedTags: [],
        actions: [
          'ogr-editor-dashboard-action-re-open',
          'ogr-editor-dashboard-action-go-to'
        ],
        tab: 'closed'
      },
      containerComponent: 'ogr-editor-dashboard-overview',
      includedTags: [],
      excludedTags: [],
      actions: [],
      key: undefined,
      tab: ''
    }
  },

  methods: {
    prepareComponent (component) {
      this.containerComponent = component.cmp
      this.includedTags = component.includedTags
      this.excludedTags = component.excludedTags
      this.actions = component.actions
      this.key = component.id
      this.tab = component.tab
    }
  }
}
</script>

<style scoped>

</style>
