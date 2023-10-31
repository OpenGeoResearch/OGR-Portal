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
  <v-container>
    <v-row v-if="false" class="mt-2">
      <v-spacer></v-spacer>
      <v-col>
        <v-card
          width="1000"
          color="info"
        >
          <v-card-title class="text-h4">
            <v-icon
              large
              color="black"
            >
              mdi-account-hard-hat
            </v-icon>
            <v-spacer></v-spacer>
            <span>Under Construction!</span>
            <v-spacer></v-spacer>
            <v-icon
              large
              color="black"
            >
              mdi-account-hard-hat
            </v-icon>
          </v-card-title>
          <v-card-text class="text-h6 text-center">
            Hier wird noch gebaut. Es sind noch nicht alle Funktionen des Editor-Dashboards verfügbar.
          </v-card-text>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col cols="6">
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
              mdi-chart-line
            </v-icon>
            <span class="text-h5 font-weight-light">Statistik: Fragen</span>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="7">
                <v-list-item class="text-h6 font-weight-light">Neue Fragen (letzte 24 Stunden):</v-list-item>
                <v-list-item class="text-h6 font-weight-light">Fragen insgesamt:</v-list-item>
              </v-col>
              <v-col v-if="dashboardData">
                <v-list-item class="text-h6 font-weight-bold">{{ dashboardData.newQuestions }}</v-list-item>
                <v-list-item class="text-h6 font-weight-bold">{{ dashboardData.allQuestions }}</v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-alert>

        <v-alert
          class="pa-0 mt-3"
          outlined
          color="primary"
        >
          <v-card-title>
            <v-icon
              large
              left
            >
              mdi-chart-line
            </v-icon>
            <span class="text-h5 font-weight-light">Statistik: Antworten</span>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="7">
                <v-list-item class="text-h6 font-weight-light">Antworten ausstehend:</v-list-item>
                <v-list-item class="text-h6 font-weight-light">Antworten erhalten:</v-list-item>
                <v-list-item class="text-h6 font-weight-light">Nicht zu Beantworten:</v-list-item>
                <v-list-item class="text-h6 font-weight-light">Antworten der Community:</v-list-item>
              </v-col>
              <v-col>
                <v-list-item class="text-h6 font-weight-bold">---</v-list-item>
                <v-list-item class="text-h6 font-weight-bold">---</v-list-item>
                <v-list-item class="text-h6 font-weight-bold">---</v-list-item>
                <v-list-item class="text-h6 font-weight-bold">---</v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-alert>

        <v-alert
          class="pa-0 mt-3"
          outlined
          color="primary"
        >
          <v-card-title>
            <v-icon
              large
              left
            >
              mdi-lightbulb
            </v-icon>
            <span class="text-h5 font-weight-light">Legende: Funktionale Tags</span>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="3">
                <span class="font-weight-bold black--text">answered-comm</span><br>
                <span class="font-weight-bold black--text">answered-exp</span><br>
                <span class="font-weight-bold black--text">unanswered-comm</span><br>
                <span class="font-weight-bold black--text">unanswered-exp</span><br>
                <span class="font-weight-bold black--text">needs-review</span><br>
                <span class="font-weight-bold black--text">handled</span><br>
                <span class="font-weight-bold black--text">potential</span><br>
                <span class="font-weight-bold black--text">edited</span><br>
                <span class="font-weight-bold black--text">exp-inquired-first</span><br>
                <span class="font-weight-bold black--text">exp-inquired-second</span><br>
                <span class="font-weight-bold black--text">answer-received</span><br>
                <span class="font-weight-bold black--text">closed</span>
              </v-col>
              <v-col cols="9">
                <span class="black--text">Antwort aus Community vorhanden</span><br>
                <span class="black--text">Antwort von ExpertIn vorhanden</span><br>
                <span class="black--text">Keine Antwort aus Community vorhanden</span><br>
                <span class="black--text">Keine Antwort von ExpertIn vorhanden</span><br>
                <span class="black--text">Muss bearbeitet werden</span><br>
                <span class="black--text">Funktionale Tags wurden gesetzt</span><br>
                <span class="black--text">Als interessant markiert</span><br>
                <span class="black--text">Inhalte der Frage wurden bearbeitet</span><br>
                <span class="black--text">ExpertIn wurde angefragt (1. Beantwortungsrunde)</span><br>
                <span class="black--text">ExpertIn wurde angefragt (2. Beantwortungsrunde)</span><br>
                <span class="black--text">Antwort auf Anfrage erhalten</span><br>
                <span class="black--text">Es können keine Antworten mehr hinzugefügt werden</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-alert>
      </v-col>
      <v-col cols="6">
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
              mdi-chat-question
            </v-icon>
            <span class="text-h5 font-weight-light">Neueste Fragen</span>
          </v-card-title>
          <ogr-editor-dashboard-table-mini
            :items="questions"
            :actions="actions"
            :image-width="100"
          />
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import questionsByEditorFilter from '@/apollo/queries/questionsByEditorFilter'
import dashboardData from '@/apollo/queries/dashboardData.gql'
import OgrEditorDashboardTableMini from './table/OgrEditorDashboardTableMini'

export default {
  name: 'OgrEditorDashboardOverview',
  components: { OgrEditorDashboardTableMini },
  data () {
    return {
      questions: [],
      actions: [],
      dashboardData: undefined
    }
  },

  mounted () {
    this.getData()
  },

  methods: {
    closeDashboard () {
      this.$emit('closeFullscreen')
    },
    getData () {
      this.getDashboardData()
      this.submitFilter(
        ['unanswered-exp'],
        ['handled'],
        '',
        [],
        []
      )
    },
    submitFilter (includedTags, excludedTags, categoryCode, dates, semanticTags) {
      this.$apollo.query({
        query: questionsByEditorFilter,
        variables: {
          includedTags,
          excludedTags,
          categoryCode,
          dates,
          semanticTags
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.questions = response.data.questionsByEditorFilter
      })
    },
    getDashboardData () {
      this.$apollo.query({
        query: dashboardData,
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.dashboardData = response.data.dashboardData
      })
    }
  }
}
</script>

<style scoped>

</style>
