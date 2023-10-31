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
  <v-card tile>
    <div v-if="userData.userData && isExpert">
      <v-card-title v-if="userData.userData.name === null">
        {{ userData.username }}
      </v-card-title>
      <v-card-title v-else>
        {{ userData.userData.name }} ({{ userData.username }})
      </v-card-title>
    </div>

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

        <user-profile-info-item v-if="userData.userData" :title="isExpert ? $t('user_profile_title_fields_expert') + ':' : $t('user_profile_title_fields_user') + ':'">
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

        <user-profile-info-item v-if="userData.userData && isExpert" :title="$t('user_profile_title_region') + ':'">
          <span style="word-break: break-word;">{{ userData.userData.expertRegion !== null ? userData.userData.expertRegion.name : $t('user_profile_placeholder_region') }}</span>
        </user-profile-info-item>

        <user-profile-info-item v-if="userData.userData && isExpert" :title="$t('user_profile_title_affiliation') + ':'">
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
      </v-list>
    </div>
    <div v-if="!userData.userData">
      <v-card-subtitle>
        {{ $t('user_profile_placeholder_full') }}
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script>
import { getCategoryFromCode } from '@/util/ogr-utils'
import UserProfileInfoItem from '@/components/ogr/user/UserProfileInfoItem'

export default {
  name: 'UserProfileInfo',
  components: { UserProfileInfoItem },
  props: {
    userData: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  computed: {
    isExpert: function () {
      return this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EXPERT')
    }
  },

  data () {
    return {
    }
  },

  methods: {
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
.disable-events {
  pointer-events: none
}
</style>
