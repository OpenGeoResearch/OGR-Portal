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
    <v-row>
      <v-spacer></v-spacer>
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
              mdi-human-greeting
            </v-icon>
            <span class="text-h5 font-weight-light">Willkommen</span>
          </v-card-title>
          <v-card-text>
            Willkommen im Serien-Dashboard
          </v-card-text>
          <v-card-text>
            Hier kannst du Fragenserien erstellen und verwalten. Mit einer Fragenserien können Hinweise und Beobachtungen zu einer übergeordneten Fragestellung zusammengetragen werden. So kann Beispielweise eine Gruppe gemeinsam nach Beobachtungen wie Hochwasserschäden oder historischen Befestigungsanlagen suchen und diese direkt über die App auf der Karte festhalten.
          </v-card-text>
          <v-card-text>
            Unter "Neue Serie erstellen" kannst du eine neue Serie erstellen.<br>
            Unter "Meine Serien verwalten" kannst du Serien sehen, die du selbst erstellt hast und dort ggf. auch Beiträge sperren.<br>
            Unter "Alle Serien Anzeigen" kannst du alle Serien sehen, die es in OpenGeoResearch gibt.
          </v-card-text>
          <v-card-text>
            Für mehr Informationen zu Fragenserien schau mal hier vorbei: <a :href="ogrHpUrl + '/serien'" target="_blank">{{ $t('series_more_info') }}</a>
          </v-card-text>
        </v-alert>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'OgrSeriesDashboardOverview',

  data () {
    return {
      ogrHpUrl: this.$config.ogrHpUrl
    }
  },

  methods: {
    closeDashboard () {
      this.$emit('closeFullscreen')
    }
  }
}
</script>

<style scoped>

</style>
