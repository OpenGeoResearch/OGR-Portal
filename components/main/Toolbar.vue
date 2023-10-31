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
  <v-app-bar
    class="include"
    color="primary"
    height="64px"
    app
    dark
  >
    <template
      v-if="!isMobile() && !$vuetify.breakpoint.xs"
    >
      <nuxt-link
        to="/"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-img
              class="ml-n1"
              :src="logo"
              max-height="40"
              max-width="160"
              contain
              v-on="on"
              v-bind="attrs"
            >
            </v-img>
          </template>
          <span>Home</span>
        </v-tooltip>
      </nuxt-link>
    </template>
    <v-tooltip
      v-if="isMobile() || $vuetify.breakpoint.xs"
      bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-n1"
          v-on="on"
          v-bind="attrs"
          icon
          to="/"
        >
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </template>
      <span>Home</span>
    </v-tooltip>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>

export default {
  name: 'Toolbar',

  data: function () {
    return {
      logo: '/img/logo.png'
    }
  },

  methods: {
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}

</script>

<style >

</style>
