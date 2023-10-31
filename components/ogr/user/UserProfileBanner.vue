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
  <v-card
    class="d-flex flex-column"
    tile
    outlined
    elevation="6"
    height="200px"
  >
    <v-img
      height="100%"
      :src="bannerUrl !== '' ? bannerUrl : '/img/banner_default.jpg'"
    >
      <v-app-bar
        flat
        color="rgba(0, 0, 0, 0)"
      >
        <v-toolbar-title class="text-h6 pl-0 white--text">
          {{ username }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="(user ? user.username === username : false)"
              color="white"
              icon
              v-bind="attrs"
              v-on="on"
              @click="$emit('click-edit-profile')"
            >
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('user_profile_tooltip_edit') }}</span>
        </v-tooltip>
      </v-app-bar>
      <v-list-item>
        <v-list-item-avatar
          color="grey darken-1"
          width="80"
          height="80"
        >
          <v-img
            class="elevation-6"
            alt=""
            :src="avatarUrl ? avatarUrl : '/img/avatar_default.png'"
          ></v-img>
        </v-list-item-avatar>
      </v-list-item>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-list-item>
          <v-row
            align="center"
            justify="end"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="mr-1 mb-4"
                  color="white"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-comment-check
                </v-icon>
              </template>
              <span>{{ $t('user_profile_tooltip_answers') }}</span>
            </v-tooltip>
            <span class="subheading mr-2 mb-4 white--text">{{ answers }}</span>

            <span class="mr-2 mb-4"></span>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="mr-1 mb-4"
                  color="white"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-thumbs-up-down
                </v-icon>
              </template>
              <span>{{ $t('user_profile_tooltip_votes') }}</span>
            </v-tooltip>
            <span class="subheading white--text mb-4"> {{ votes < 0 ? votes : '+' + votes }}</span>
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-img>
  </v-card>
</template>

<script>

export default {
  name: 'UserProfileBanner',

  props: {
    username: {
      type: String,
      required: true,
      default: ''
    },
    bannerUrl: {
      type: String,
      required: false,
      default: ''
    },
    avatarUrl: {
      type: String,
      required: false,
      default: ''
    },
    answers: {
      type: Number,
      required: false,
      default: 0
    },
    votes: {
      type: Number,
      required: false,
      default: 0
    }
  },

  computed: {
    isExpert: function () {
      return this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EXPERT')
    }
  },

  data () {
    return {
      user: this.$auth.user
    }
  }
}

</script>

<style scoped>

</style>
