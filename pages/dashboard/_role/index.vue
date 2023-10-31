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
    <ogr-expert-dashboard
      v-if="dashboard === 'EXPERT_DASHBOARD'"
    />

    <ogr-editor-dashboard
      v-if="dashboard === 'EDITOR_DASHBOARD'"
    />

    <ogr-mod-dashboard
      v-if="dashboard === 'MODERATOR_DASHBOARD'"
    />

    <ogr-series-dashboard
        v-if="dashboard === 'SERIES_DASHBOARD'"
    />

    <v-col cols="12" v-if="dashboard === 'NOT_ALLOWED'">
      <v-card>
        <ogr-dashboard-tools-info-access
          title="Kein Zugriff auf diese Seite."
          text="Hier hast du keinen Zugriff. Klicke auf \'Zur Startseite\' und du kommst zurück zum Fragenportal."
          button="Zur Startseite"
        />
      </v-card>
    </v-col>
    <v-col cols="12" v-if="dashboard === 'NOT_LOGGED_IN'">
      <ogr-dashboard-tools-info-access
        title="Hierfür musst du eingeloggt sein."
        text="Du kannst diese Seite nur aufrufen, wenn du eingeloggt bist. Klicke auf \'Zur Startseite\' und logge dich wie gewohnt ein. Danach kannst du das Dashboard über das Menu aufrufen."
        button="Zur Startseite"
      />
    </v-col>
  </v-row>
</template>

<script>
import OgrExpertDashboard from '../../../components/ogr/dashboard/expert/OgrExpertDashboard'
import OgrEditorDashboard from '../../../components/ogr/dashboard/editor/OgrEditorDashboard'
import OgrModDashboard from '../../../components/ogr/dashboard/moderator/OgrModDashboard'
import OgrDashboardToolsInfoAccess from '../../../components/ogr/dashboard/tools/OgrDashboardToolsInfoAccess'
import OgrSeriesDashboard from '../../../components/ogr/dashboard/series/OgrSeriesDashboard'
export default {
  components: { OgrSeriesDashboard, OgrDashboardToolsInfoAccess, OgrModDashboard, OgrEditorDashboard, OgrExpertDashboard },
  layout: 'dashboard',

  data: function () {
    return {
      dashboard: undefined,
      role: undefined,
      loggedIn: true
    }
  },

  mounted () {
    this.role = this.$route.params.role
    if (this.$auth.loggedIn) {
      if (this.role === 'expert') {
        if (this.$auth.user.roles.includes('ROLE_EXPERT')) {
          this.dashboard = 'EXPERT_DASHBOARD'
        } else {
          this.dashboard = 'NOT_ALLOWED'
        }
      } else if (this.role === 'editor') {
        if (this.$auth.user.roles.includes('ROLE_EDITOR')) {
          this.dashboard = 'EDITOR_DASHBOARD'
        } else {
          this.dashboard = 'NOT_ALLOWED'
        }
      } else if (this.role === 'moderator') {
        if (this.$auth.user.roles.includes('ROLE_MODERATOR')) {
          this.dashboard = 'MODERATOR_DASHBOARD'
        } else {
          this.dashboard = 'NOT_ALLOWED'
        }
      } else if (this.role === 'series') {
        if (this.$auth.user.roles.includes('ROLE_EDITOR') || this.$auth.user.roles.includes('ROLE_TEACHER')) {
          this.dashboard = 'SERIES_DASHBOARD'
        } else {
          this.dashboard = 'NOT_ALLOWED'
        }
      } else {
        window.$nuxt.$router.replace('/')
      }
    } else {
      this.dashboard = 'NOT_LOGGED_IN'
    }
  }
}
</script>

<style scoped>

</style>
