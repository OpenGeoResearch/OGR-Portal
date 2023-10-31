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
  <v-card class="ma-0 pa-0 mb-2" elevation="0" :color="color">
    <v-card-actions class="mb-0 pb-0 mt-0 pt-0">
      <v-switch
        v-model="showWms"
        color="primary"
        :label="$t('forum_wms_title')"
        @change="toggleWmsLayers($event)"
      />
    </v-card-actions>
    <v-card-actions
      v-for="layer in wms"
      :key="layer.id"
      class="mb-0 pb-0 mt-0 pt-0"
    >
      <v-menu
        top
        right
      >
        <template v-slot:activator="{ on }">
          <v-switch
            class="mb-0 pb-0 mt-0 pt-0"
            :value="layer.visible"
            :input-value="layer.visible"
            color="secondary"
            :label="layer.title"
            :append-icon="mdiInformationOutline"
            :disabled="!showWms"
            @change="toggleLayer($event, layer.id)"
            @click:append="on.click"
          ></v-switch>
        </template>
        <v-card max-width="800">
          <v-card-subtitle class="font-weight-medium">{{ layer.description === null && layer.legend === null ? $t('forum_wms_info_no_available') : layer.title }}</v-card-subtitle>
          <v-card-text v-if="layer.description !== ''">{{ layer.description }}</v-card-text>
          <v-card-text v-if="layer.legend"><v-img :src="layer.legend"></v-img></v-card-text>
        </v-card>
      </v-menu>
      <v-spacer />
      <v-card
        elevation="0"
        class="ma-0 pa-0"
        width="150"
        :color="color"
      >
        <v-slider
          :value="layer.opacity * 100"
          class="ml-2"
          :prepend-icon="mdiCircleOpacity"
          color="secondary"
          :background-color="color"
          thumb-label
          :disabled="!showWms"
          @input="setOpacity($event, layer.id)"
        ></v-slider>
      </v-card>
    </v-card-actions>
  </v-card>
</template>

<script>

import { mdiCircleOpacity, mdiInformationOutline } from '@mdi/js'
import { mapState } from 'vuex'

export default {
  name: 'OgrForumAnswerLayerPanel',
  data () {
    return {
      mdiCircleOpacity,
      mdiInformationOutline,
      opacity: 0,
      showWms: false
    }
  },

  props: {
    wms: {
      type: Array,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState('layers', ['layers'])
  },

  beforeDestroy () {
    this.removeLayers()
  },

  methods: {
    addLAyers () {
      this.wms.forEach((layer) => {
        this.$store.commit('layers/addLayer', {
          id: layer.id + 5,
          title: layer.title,
          cmp: 'vl-layer-tile',
          visible: layer.visible,
          selectable: false,
          opacity: parseFloat(layer.opacity),
          source: {
            cmp: 'vl-source-wms',
            tiled: true,
            layers: layer.layers,
            url: layer.url
          }
        })
      })
    },
    removeLayers () {
      this.wms.forEach((layer) => {
        this.$store.commit('layers/removeLayer', layer.id + 5)
      })
    },
    toggleWmsLayers (event) {
      if (event) {
        this.addLAyers()
      } else {
        this.removeLayers()
      }
    },
    toggleLayer (event, id) {
      console.log(id)
      this.$nuxt.$emit('setLayerVisibility', id + 5, !!event)
    },
    setOpacity (event, id) {
      console.log(id)
      this.$nuxt.$emit('setLayerOpacity', id + 5, event / 100)
    }
  }
}
</script>
