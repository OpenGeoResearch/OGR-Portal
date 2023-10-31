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
            Willkommen im Experten-Dashboard
          </v-card-text>
          <v-card-text>
            Hier kannst du Fragen sehen, die dir von unseren Editor:Innen zugesendet wurden. Von jetzt an bekommst du - oder dein Team - nicht mehr nur eine Mail, sondern du hast ab sofort auch Zugriff auf dieses Dashboard direkt in OpenGeoReserach.
          </v-card-text>
          <v-card-text>
            Unter "Angefragt" kannst du alle Fragen sehen, die von unseren Editor:Innen zu dir geleitet wurden. Dort hast du die Möglichkeit diese zu beantworten oder anzugeben, dass du keine Antwort auf diese Frage geben kannst. Diese Information geht dann direkt zurück zu unseren Editor:Innen. <br>
            Unter "Beantwortet" werden alle Fragen aufgelistet, die du aufgrund einer Anfrage durch unsere Editor:innen beantwortet hast.<br>
            Unter "Nicht beantwortet" siehst du alle Fragen die nicht von dir beantwortet werden konnten.
          </v-card-text>
          <v-card-text>
            Auf der rechten Seite sieht du zusätzlich noch ein paar Statistiken zu deinen schon beantworteten Fragen.
          </v-card-text>
        </v-alert>

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
              mdi-account
            </v-icon>
            <span class="text-h5 font-weight-light">
              <span>Meine Profilinformationen - </span>
              <span v-if="userData.userData">
                {{ userData.userData.name === null ? userData.username : userData.userData.name + ' (' + userData.username + ')'}}
              </span>
            </span>
          </v-card-title>

          <div v-if="userData.roles">
            <v-list class="transparent">
              <user-profile-info-item :title="$t('user_profile_title_roles') + ':'">
                <v-chip
                  class="mr-1 mb-1 disable-events"
                  v-for="role in prepareRoles(userData.roles)"
                  :key="role.label"
                  :color="role.color"
                  outlined
                  small
                >
                  {{ role.label }}
                </v-chip>
              </user-profile-info-item>

              <user-profile-info-item v-if="userData.userData" :title="$t('user_profile_title_description') + ':'">
                <span style="word-break: break-word;">{{ userData.userData.description !== null ? userData.userData.description : $t('user_profile_placeholder_description') }}</span>
              </user-profile-info-item>

              <user-profile-info-item v-if="userData.userData" :title="$t('user_profile_title_fields_expert') + ':' ">
            <span
              v-if="userData.userData.field1 === null && userData.userData.field2 === null && userData.userData.field3 === null"
              style="word-break: break-word;"
            >
              {{ $t('user_profile_placeholder_fields') }}
            </span>
            <v-row no-gutters
             class="ma-0 pa-0"
            >
              <v-chip
                v-if="userData.userData.field1"
                class="mt-0 pt-0 pb-0 mb-1 disable-events"
                label
                small
                color="highlight"
              >
                {{ prepareCategory(userData.userData.field1) }}
              </v-chip>
            </v-row>
            <v-row no-gutters
              class="ma-0 pa-0"
            >
              <v-chip
                v-if="userData.userData.field2"
                class="mt-0 pt-0 pb-0 mb-1 disable-events"
                label
                small
                color="highlight"
              >
                {{ prepareCategory(userData.userData.field2) }}
              </v-chip>
            </v-row>
            <v-row no-gutters
              class="ma-0 pa-0"
            >
              <v-chip
                v-if="userData.userData.field3"
                class="mt-0 pt-0 pb-0 mb-1 disable-events"
                label
                small
                color="highlight"
              >
                {{ prepareCategory(userData.userData.field3) }}
              </v-chip>
            </v-row>
              </user-profile-info-item>
              <user-profile-info-item v-if="userData.userData" :title="$t('user_profile_title_region') + ':'">
                <span style="word-break: break-word;">{{ userData.userData.expertRegion !== null ? userData.userData.expertRegion.name : $t('user_profile_placeholder_region') }}</span>
              </user-profile-info-item>
              <user-profile-info-item v-if="userData.userData" :title="$t('user_profile_title_affiliation') + ':'">
                <span style="word-break: break-word;">{{ userData.userData.affiliationName !== null ? userData.userData.affiliationName : $t('user_profile_placeholder_affiliation') }}</span>
                <v-btn
                  v-if="userData.userData.affiliationUrl"
                  icon
                  x-small
                  :href="userData.userData.affiliationUrl"
                  target="_blank"
                >
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </user-profile-info-item>
              <user-profile-info-item title="Optionen:">
                <v-btn
                  color="primary"
                  :to="'/user/' + this.$auth.user.username"
                >
                  Zu meinem Profil
                </v-btn>
              </user-profile-info-item>
            </v-list>
          </div>
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
              mdi-chart-line
            </v-icon>
            <span class="text-h5 font-weight-light">Statistik: Meine Experten-Anfragen</span>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="7">
                <v-list-item>
                  <span class="text-h6 font-weight-light">Offene Anfragen:</span>
                  <v-spacer />
                  <span class="text-h6 font-weight-bold">{{ dashboardData.expertInquiryData.open }}</span>
                </v-list-item>
                <v-list-item>
                  <span class="text-h6 font-weight-light">Fragen beantwortet:</span>
                  <v-spacer />
                  <span class="text-h6 font-weight-bold">{{ dashboardData.expertInquiryData.answered }}</span>
                </v-list-item>
                <v-list-item>
                  <span class="text-h6 font-weight-light">keine Antwort gefunden:</span>
                  <v-spacer />
                  <span class="text-h6 font-weight-bold">{{ dashboardData.expertInquiryData.rejected }}</span>
                </v-list-item>
                <v-list-item>
                  <span class="text-h6 font-weight-light">Anfragen gesamt:</span>
                  <v-spacer />
                  <span class="text-h6 font-weight-bold">{{ dashboardData.expertInquiryData.inquired }}</span>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-alert>

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
            <span class="text-h5 font-weight-light">Statistik: Meine Antworten</span>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="7">
                <v-list-item>
                  <span class="text-h6 font-weight-light">Gegebene Antworten:</span>
                  <v-spacer />
                  <span class="text-h6 font-weight-bold">{{ dashboardData.expertAnswerData ? dashboardData.expertAnswerData.answers : '' }}</span>
                </v-list-item>
                <v-list-item>
                  <span class="text-h6 font-weight-light">Votes insgesamt:</span>
                  <v-spacer />
                  <span class="text-h6 font-weight-bold">{{ dashboardData.expertAnswerData ? dashboardData.expertAnswerData.votes : '' }}</span>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-alert>

        <v-alert
          v-if="false"
          class="pa-0"
          outlined
          color="primary"
        >
          <v-card-title>
            <v-icon
              large
              left
            >
              mdi-trophy-variant
            </v-icon>
            <span class="text-h5 font-weight-light">Das sind die aktivsten Expert:Innen (Teams)</span>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="7">
              </v-col>
            </v-row>
          </v-card-text>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getCategoryFromCode } from '@/util/ogr-utils'
import UserProfileInfoItem from '../../user/UserProfileInfoItem'

export default {
  name: 'OgrExpertDashboardOverview',
  components: { UserProfileInfoItem },
  data () {
    return {
    }
  },

  props: {
    dashboardData: {
      type: Object,
      required: true,
      default: () => { return {} }
    },
    userData: {
      type: Object,
      required: true,
      default: () => { return {} }
    }
  },
  methods: {
    closeDashboard () {
      this.$emit('closeFullscreen')
    },
    prepareRoles (input) {
      const roles = []
      for (const role of input) {
        if (role.name === 'ROLE_EXPERT') {
          roles.push({ id: 2, label: 'Expert:In', color: 'primary' })
        } else if (role.name === 'ROLE_EDITOR') {
          roles.push({ id: 4, label: 'Editor:In', color: 'info' })
        } else if (role.name === 'ROLE_MODERATOR') {
          roles.push({ id: 3, label: 'Moderator:In', color: 'info' })
        } else if (role.name === 'ROLE_USER') {
          roles.push({ id: 1, label: 'Benutzer:In', color: 'secondary' })
        } else if (role.name === 'ROLE_ADMIN') {
          roles.push({ id: 5, label: 'Administrator:In', color: 'warning' })
        }
      }
      roles.sort(function (a, b) {
        return a.id - b.id
      })
      return roles
    },
    prepareCategory (code) {
      if (code) {
        return getCategoryFromCode(code, this.$i18n.locale)
      }
    }

  }
}
</script>

<style scoped>

</style>
