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
  <v-sheet width="100vw" align="center">
    <v-spacer></v-spacer>
    <v-card width="600" align="center" class="mt-8">
      <v-card-title>
        <v-spacer></v-spacer>
        {{ title }}
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-spacer></v-spacer>
        {{ text }}
        <v-spacer></v-spacer>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          to="/"
        >
          {{ button }}
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <v-spacer></v-spacer>
  </v-sheet>
</template>

<script>

export default {
  name: 'OgrDashboardToolsInfoAccess',

  data: function () {
    return {
    }
  },
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    text: {
      type: String,
      required: true,
      default: ''
    },
    button: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>
