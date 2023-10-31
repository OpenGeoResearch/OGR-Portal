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
  <div>
    <ogr-forum-button-with-tooltip
      v-if="series.parentQuestion.id"
      color="info"
      :icon="mdiFormatListText"
      :tooltip="$t('series_list_elements').toString()"
      @click="goToSeries"
    />
    <ogr-forum-button-with-tooltip
      v-if="selectedSeries !== series.tag"
      color="info"
      :icon="mdiMapPlus"
      :tooltip="$t('forum_tooltip_show_on_map').toString()"
      @click="showSeriesLayers"
    />
    <ogr-forum-button-with-tooltip
      v-else
      color="info"
      :icon="mdiMapMinus"
      :tooltip="$t('forum_tooltip_hide_on_map').toString()"
      @click="hideSeriesLayers"
    />
    <ogr-forum-button-with-tooltip
      v-if="series.parentQuestion.id"
      color="secondary"
      :icon="mdiMapSearch"
      :tooltip="$t('forum_tooltip_zoom_to_series').toString()"
      @click="zoomToQuestion"
    />
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="series.parentQuestion.id"
          color="external"
          :href="ogrMapUrl + '/question/' + series.parentQuestion.id"
          target="_blank"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>
            {{ mdiOpenInNew }}
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('forum_tooltip_open_in_new') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mdiOpenInNew, mdiMapSearch, mdiFormatListText, mdiMapPlus, mdiMapMinus } from '@mdi/js'

import OgrForumButtonWithTooltip from '@/components/ogr/forum/OgrForumButtonWithTooltip'
import { mapState } from 'vuex'

export default {
  name: 'OgrForumSeriesParentPreviewButtons',
  components: { OgrForumButtonWithTooltip },

  data () {
    return {
      mdiOpenInNew,
      mdiMapSearch,
      mdiMapPlus,
      mdiMapMinus,
      mdiFormatListText,
      ogrMapUrl: this.$config.ogrMapUrl
    }
  },

  computed: {
    ...mapState('ogr', ['selectedSeries'])
  },

  props: {
    series: {
      type: Object,
      required: true
    }
  },

  methods: {
    goToSeries () {
      const path = '/series/' + this.series.id
      this.$router.push(path)
    },
    showSeriesLayers () {
      if (this.seriesTag !== '') {
        // this.$store.commit('ogr/resetFilters')
        this.$store.commit('ogr/addTag', this.series.tag)
        this.$store.commit('ogr/setSelectedSeries', this.series.tag)
        this.$nuxt.$emit('updateLayer', 'OGR')
        this.$nuxt.$emit('updateLayer', 'OGR_Cluster')
        this.$nuxt.$emit('updateLayer', 'OGR_Series')
        this.$nuxt.$emit('updateLayer', 'OGR_Series_Cluster')
        this.$nuxt.$emit('setLayerVisibility', 'OGR_Series', true)
        this.$nuxt.$emit('setLayerVisibility', 'OGR_Series_Cluster', true)
        this.$nuxt.$emit('zoomToLayer', 'OGR_Series_Cluster')
      }
      this.show = true
    },
    hideSeriesLayers () {
      if (this.series.tag !== '') {
        this.$store.commit('ogr/removeTag', this.series.tag)
        this.$store.commit('ogr/setSelectedSeries', undefined)
        this.$nuxt.$emit('updateLayer', 'OGR')
        this.$nuxt.$emit('updateLayer', 'OGR_Cluster')
        this.$nuxt.$emit('updateLayer', 'OGR_Series')
        this.$nuxt.$emit('updateLayer', 'OGR_Series_Cluster')
        this.$nuxt.$emit('setLayerVisibility', 'OGR_Series', false)
        this.$nuxt.$emit('setLayerVisibility', 'OGR_Series_Cluster', false)
      }
      this.show = false
    },
    zoomToQuestion () {
      this.$nuxt.$emit('centerMap', this.series.parentQuestion.datastream.observedArea.coordinates)
      this.$nuxt.$emit('zoomToCoordinates', this.series.parentQuestion.datastream.observedArea.coordinates)
    }
  }
}
</script>
