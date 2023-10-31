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
  <v-card width="100%" elevation="0" class="ma-0 pa-0">
    <v-divider class="" />
    <v-form
      ref="form"
      v-model="isFormValid"
    >
      <v-radio-group
        v-model="service.type"
        class="mt-0"
        row
        dense
      >
        <v-radio
          label="WMS"
          value="wms"
        ></v-radio>
        <v-radio
          label="WFS"
          value="wfs"
          disabled
        ></v-radio>
      </v-radio-group>
      <v-text-field
        v-model="service.title"
        dense
        outlined
        label="Name der Karte (wird in der Antwort angezeigt)"
        counter="200"
        :rules="[rules.required, rules.length(200)]"
      ></v-text-field>
      <v-text-field
        v-model="service.url"
        dense
        outlined
        :label="service.type === 'wms' ? 'GetMap-URL' : 'GetFeatures-URL'"
        counter="1000"
        :rules="[rules.required, rules.length(1000)]"
      ></v-text-field>
      <v-text-field
        v-model="service.layers"
        dense
        outlined
        label="Name des Layer"
        counter="200"
        :rules="[rules.required, rules.length(200)]"
      ></v-text-field>
      <v-text-field
        v-model="service.description"
        dense
        outlined
        label="Beschreibung (optional)"
        counter="2000"
        :rules="[rules.length(2000)]"
      ></v-text-field>
      <v-text-field
        v-model="service.legend"
        dense
        outlined
        label="GetLegendGraphic-URL (optional)"
        counter="1000"
        :rules="[rules.length(1000)]"
      ></v-text-field>
      <v-btn
        class="ml-1"
        small
        @click="$emit('click-cancel')"
      >
        Abbrechen
      </v-btn>
      <v-btn
        class="ml-1"
        small
        color="secondary"
        :disabled="!isFormValid"
        @click="previewService"
      >
        Vorschau
      </v-btn>
      <v-btn
        class="ml-1"
        small
        color="primary"
        :disabled="!isFormValid || !preview"
        @click="addService"
      >
        Übernehmen
      </v-btn>
    </v-form>
    <v-divider class="mt-2 mb-2" />
  </v-card>
</template>

<script>

import { mapState } from 'vuex'

export default {

  name: 'OgrGeoServiceInput',
  data () {
    return {
      service: {
        id: null,
        type: 'wms',
        url: '',
        layers: '',
        title: '',
        visible: true,
        opacity: 1,
        description: null,
        legend: null
      },
      isFormValid: false,
      rules: {
        required: (value) => { return !!value || this.$t('auth_rule_mandatory') },
        length: len => v => (v || '').length <= len || this.$t('input_text_length', [len])
      },
      preview: false
    }
  },

  computed: {
    ...mapState('layers', ['layers'])
  },

  methods: {
    previewService () {
      console.log(this.service)
      if (this.service.title !== '' && this.service.url !== '' && this.service.layers !== '') {
        console.log(this.layers)
        this.service.id = this.layers.length
        if (this.service.type === 'wms') {
          this.addWMS(this.service.id, this.service.title, this.service.url, this.service.layers)
          this.preview = true
        }
      }
    },
    addService () {
      if (this.service.type === 'wms') {
        this.$emit('update-web-map-services', this.service)
      }
    },
    addWMS (id, title, url, layers) {
      this.$store.commit('layers/addLayer', {
        id: id,
        title: title,
        cmp: 'vl-layer-tile',
        visible: true,
        selectable: false,
        opacity: 1,
        source: {
          cmp: 'vl-source-wms',
          tiled: true,
          layers: layers,
          url: url
        }
      })
    }
  }
}
</script>
