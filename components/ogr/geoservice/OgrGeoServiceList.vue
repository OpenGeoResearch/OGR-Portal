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
  <v-card class="ma-0 pa-0" elevation="0">
    <v-card-actions
      v-for="layer in services"
      :key="layer.id"
      class="mb-0 pb-0 mt-0 pt-0"
    >
      <v-menu
        bottom
        left
      >
        <template v-slot:activator="{ on }">
          <v-switch
            class="mb-0 pb-0 mt-0 pt-0"
            :value="layer.visible"
            :input-value="layer.visible"
            color="secondary"
            :label="layer.title"
            :append-icon="mdiInformationOutline"
            @change="toggleLayer($event, layer.id)"
            @click:append="on.click"
          ></v-switch>
        </template>
        <v-card max-width="800">
          <v-card-subtitle class="font-weight-medium">{{ layer.title !== '' ? layer.title : $t('tools_layers_info_not_available') }}</v-card-subtitle>
          <v-card-text v-if="layer.description !== ''">{{ layer.description }}</v-card-text>
          <v-card-text v-if="layer.legend"><v-img :src="layer.legend"></v-img></v-card-text>
        </v-card>
      </v-menu>
      <v-spacer />
      <v-card
          elevation="0"
          class="ma-0 pa-0"
          width="150"
      >
        <v-slider
          value="100"
          class="ml-2"
          :prepend-icon="mdiCircleOpacity"
          color="secondary"
          thumb-label
          @input="setOpacity($event, layer.id)"
          @change="updateOpacity($event, layer.id)"
        ></v-slider>
      </v-card>
      <v-btn
        icon
        @click="$emit('click-remove-service' , layer.id)"
      >
        <v-icon>{{ mdiDelete }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiCircleOpacity, mdiInformationOutline, mdiDelete } from '@mdi/js'

export default {
  name: 'OgrGeoServiceList',
  data () {
    return {
      mdiCircleOpacity,
      mdiInformationOutline,
      mdiDelete,
      opacity: 0
    }
  },

  props: {
    services: {
      type: Array,
      required: true
    }
  },

  methods: {
    toggleLayer (event, id) {
      this.$emit('update-layer-visibility', id, !!event)
      this.$nuxt.$emit('setLayerVisibility', id, !!event)
    },
    setOpacity (event, id) {
      this.$nuxt.$emit('setLayerOpacity', id, event / 100)
    },
    updateOpacity (event, id) {
      this.$emit('update-layer-opacity', id, event / 100)
    }
  }
}
</script>
