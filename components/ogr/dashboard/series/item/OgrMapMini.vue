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
  <div id="mini-map">
    <vl-map
      id="mini-map"
      ref="map"
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      data-projection="EPSG:4326"
      :style="style"
    >
      <!-- eslint-disable vue/no-mutating-props -->
      <vl-view
        :zoom.sync="map.zoom"
        :center.sync="map.center"
        :rotation="map.rotation"
      />
      <!-- eslint-enable -->
      <vl-feature v-if="markerCoords" id="marker-feature">
        <vl-geom-point :coordinates="markerCoords" />
        <vl-style-box>
          <vl-style-icon src="/img/markerSelect.png" :scale="0.3" :anchor="[0.5, 1]" />
        </vl-style-box>
      </vl-feature>

      <vl-layer-tile id="mini-osm">
        <vl-source-osm />
      </vl-layer-tile>
    </vl-map>
  </div>
</template>

<script>

export default {
  name: 'OgrMapMini',

  props: {
    map: undefined,
    markerCoords: undefined
  },

  data () {
    return {
      style: ''
    }
  },
  beforeMount () {
    this.style = this.createStyle()
  },

  methods: {
    createStyle () {
      const height = '215px'
      let opacity = ''
      if (this.$vuetify.theme.dark) {
        opacity = '0.9'
      }
      return 'height: ' + height + '; opacity: ' + opacity + ';'
    }
  }
}
</script>
