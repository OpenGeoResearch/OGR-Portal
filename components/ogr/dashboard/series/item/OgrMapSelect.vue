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
  <div id="select-map">
    <vl-map
      id="select-map"
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
      <vl-layer-tile id="select-osm">
        <vl-source-osm />
      </vl-layer-tile>
    </vl-map>
  </div>
</template>

<script>
import Control from 'ol/control/Control'

export default {
  name: 'OgrMapSelect',

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
  mounted () {
    if (this.manual) {
      // eslint-disable-next-line vue/no-mutating-props
      this.map.zoom = 6
    } else {
      // eslint-disable-next-line vue/no-mutating-props
      this.map.zoom = 18
    }
    const myElement = document.createElement('div')
    myElement.className = 'ol-mycontrol ol-control'

    this.$refs.map.$createPromise.then(() => {
      this.$refs.map.$map.addControl(new Control({ element: myElement }))
    })
  },
  methods: {
    createStyle () {
      const height = '' + 600 - 60 - 20 - 10 + 'px'
      let opacity = ''
      if (this.$vuetify.theme.dark) {
        opacity = '0.9'
      }
      return 'height: ' + height + '; opacity: ' + opacity + ';'
    }
  }
}
</script>

<style>
.ol-mycontrol {
  left: 50%;
  top: 50%;
  width: 26px;
  height: 40px;
  margin: -39px 0px 0px -13px;
  background: no-repeat url("/img/markerSelect.png");
  background-size: 26px
}
</style>
