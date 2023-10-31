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
  <v-alert
    outlined
    dense
    text
    color="info"
  >
    <v-card-title class="pa-0 ma-0">
      <v-icon
        left
        color="info"
      >
        mdi-map-marker-multiple
      </v-icon>
      <span>{{ isSeriesParent ? $t('series_parent_info_title') : $t('series_child_info_title') }}</span>
    </v-card-title>
    <v-card-text class="pa-0 ma-0 mb-1" style="word-break: break-word;">
      {{ isSeriesParent ? $t('series_parent_info_text') : $t('series_child_info_text') }} <a :href="ogrHpUrl + '/serien'" target="_blank">{{ $t('series_more_info') }}</a>
    </v-card-text>
    <v-card-text v-if="seriesData" class="pa-0 ma-0" style="word-break: break-word;">
      <span>{{ $t('series_name') }}</span>
      <span class="font-weight-bold">{{ seriesData.name }}</span>
    </v-card-text>
    <v-card-text v-if="seriesData && open" class="pa-0 ma-0" style="word-break: break-word;">
      <span>{{ $t('series_status') }}</span>
      <span class="font-weight-bold">{{ $t('series_status_open') }} ({{ $t('series_status_until') }} {{ seriesData.end | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }})</span>
    </v-card-text>
    <v-card-text v-else class="pa-0 ma-0" style="word-break: break-word;">
      <span>{{ $t('series_status') }}</span>
      <span class="font-weight-bold">{{ $t('series_status_closed') }}</span>
    </v-card-text>
    <v-card-text v-if="seriesData" class="pa-0 ma-0" style="word-break: break-word;">
      <span>{{ $t('series_tag') }}</span>
      <span class="font-weight-bold">{{ seriesData.tag }}</span>
    </v-card-text>
    <v-card-actions class="pa-0 ma-0 mt-1">
      <v-btn
        v-if="selectedSeries !== seriesTag"
        color="info"
        small
        @click="showSeriesLayers"
      >
        {{ $t('series_show_on_map') }}
      </v-btn>
      <v-btn
        v-else
        color="info"
        small
        @click="hideSeriesLayers"
      >
        {{ $t('series_hide') }}
      </v-btn>
      <v-btn
        v-if="seriesData"
        small
        :to="'/series/' + seriesData.id"
      >
        {{ $t('series_go_to') }}
      </v-btn>
    </v-card-actions>
  </v-alert>
</template>

<script>
import questionSeriesByTag from '~/apollo/queries/questionSeriesByTag.gql'
import { mapState } from 'vuex'

export default {
  name: 'OgrForumSeriesInfo',

  props: {
    seriesTag: {
      type: String,
      required: true
    },
    isSeriesParent: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    ...mapState('ogr', ['selectedSeries'])
  },

  data () {
    return {
      ogrHpUrl: this.$config.ogrHpUrl,
      show: false,
      seriesData: undefined,
      open: false
    }
  },

  created () {
    this.getSeriesData()
  },

  methods: {
    checkSeriesStatus () {
      this.open = Date.now() < Date.parse(this.seriesData.end)
    },
    getSeriesData () {
      this.$apollo.query({
        query: questionSeriesByTag,
        variables: {
          tag: this.seriesTag
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.seriesData = response.data.questionSeriesByTag
        this.checkSeriesStatus()
      })
    },
    showSeriesLayers () {
      if (this.seriesTag !== '') {
        // this.$store.commit('ogr/resetFilters')
        this.$store.commit('ogr/addTag', this.seriesTag)
        this.$store.commit('ogr/setSelectedSeries', this.seriesTag)
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
      if (this.seriesTag !== '') {
        this.$store.commit('ogr/removeTag', this.seriesTag)
        this.$store.commit('ogr/setSelectedSeries', undefined)
        this.$nuxt.$emit('updateLayer', 'OGR')
        this.$nuxt.$emit('updateLayer', 'OGR_Cluster')
        this.$nuxt.$emit('updateLayer', 'OGR_Series')
        this.$nuxt.$emit('updateLayer', 'OGR_Series_Cluster')
        this.$nuxt.$emit('setLayerVisibility', 'OGR_Series', false)
        this.$nuxt.$emit('setLayerVisibility', 'OGR_Series_Cluster', false)
      }
      this.show = false
    }
  }
}
</script>
