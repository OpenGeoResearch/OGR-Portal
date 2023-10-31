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
  <v-autocomplete
    single-line
    v-model="searchedRegion"
    :background-color="searchbarBackgroundColor"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    :placeholder="$t('ogr_filter_searchbar_region')"
    :label="$t('ogr_filter_searchbar_region')"
    item-text="name"
    item-value="id"
    hide-no-data
  >
    <template v-slot:item="{item}">
      <template v-if="typeof item !== 'object'">
        <v-list-item-content v-text="item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import axios from 'axios'
import GeoJSON from 'ol/format/GeoJSON'

export default {
  name: 'OgrFilterRegionSearch',

  components: {

  },
  data: function () {
    return {
      searchedRegion: null,
      search: null,
      isLoading: false,
      regions: []
    }
  },
  computed: {
    items () {
      return this.regions.map(entry => {
        return entry
      })
    },
    searchbarBackgroundColor () {
      if (this.$vuetify.breakpoint.xs || this.isMobile()) {
        return 'white'
      } else {
        return ''
      }
    }
  },
  methods: {
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  },
  watch: {
    search (val) {
      if (val == null) return
      // Items have already been requested
      if (this.isLoading) return

      if (val.length >= 3) {
        this.isLoading = true
        axios.get(this.$config.ogrGeoUrl + '/region/search?query=' + val.toLowerCase())
          .then(res => {
            this.regions = res.data
          })
          .finally(() => (this.isLoading = false))
      } else {
        this.features = []
      }
    },
    searchedRegion (value) {
      if (value !== '') {
        axios.get(this.$config.ogrGeoUrl + '/region/' + value)
          .then(res => {
            const geojson = res.data.the_geom
            const polygon = new GeoJSON().readGeometry(geojson)
            polygon.set('projection', 'EPSG:4326')
            $nuxt.$emit('zoomToGeometry', polygon)
            $nuxt.$emit('updateLayer', 'OGR')
            $nuxt.$emit('updateLayer', 'OGR_Cluster')
            this.searchedRegion = ''
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
