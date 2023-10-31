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
  <v-dialog
    :value="active"
    persistent
    width="80%"
    height="600"
    hide-overlay
    transition="slide-x-reverse-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="secondary"
      >
        <v-btn
          icon
          dark
          @click="$emit('click-dialog-close')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title />
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="$emit('click-dialog-submit')"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container
          fluid
      >
        <v-row>
          <v-col>
            <!-- eslint-disable vue/no-mutating-props -->
            <ogr-map-select
              :map.sync="map"
              :marker-coords.sync="markerCoords"
            />
            <!-- eslint-enable -->
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import OgrMapSelect from './OgrMapSelect.vue'

export default {
  name: 'OgrMapDialog',
  components: { OgrMapSelect },

  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    map: undefined,
    markerCoords: undefined
  },

  data () {
    return {
    }
  }
}
</script>
