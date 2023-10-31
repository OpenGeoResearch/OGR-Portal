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
  <v-card
    class="ma-1"
    outlined
    elevation="2"
  >
    <v-divider />
    <v-list-item
      :to="dashboard ? '/series/' + series.id : '/question/' + series.parentQuestion.id"
      :target="dashboard ? '_blank' : '_self'"
    >
      <v-list-item-avatar
        size="150"
        tile
      >
        <v-img
          v-if="this.series.parentQuestion.datastream.images[0]"
          :lazy-src="placeholder"
          :src="small(this.series.parentQuestion.datastream.images[0])"
        >
        </v-img>
        <v-img
          v-else
          :src="placeholder"
        >
        </v-img>
      </v-list-item-avatar>

      <v-list-item-content style="align-self: baseline;">
        <v-list-item-title class="text-h6">
          {{this.series.parentQuestion.datastream.name}}
        </v-list-item-title>
        <v-list-item-group>
          <v-chip
            class="disable-events mr-2"
            color="highlight"
            pill
            x-small
            label
          >
            <span class="text-truncate">
              {{classification(this.series.parentQuestion)}}
            </span>
          </v-chip>
          <v-chip
            class="disable-events"
            x-small
          >
            {{ this.series.parentQuestion.datastream.resultTime | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
          </v-chip>
        </v-list-item-group>
        <v-list-item-content>
          {{ cutText(this.series.parentQuestion.datastream.description, 200) }}
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-card
        class="ma-0 pa-0"
        elevation="0"
      >
        <v-card-text v-if="series" class="pa-0 ma-0" style="word-break: break-word;">
          <span>{{ $t('series_name') }}</span>
          <span class="font-weight-bold">{{ series.name }}</span>
        </v-card-text>
        <v-card-text v-if="series && seriesStatus" class="pa-0 ma-0" style="word-break: break-word;">
          <span>{{ $t('series_status') }}</span>
          <span class="font-weight-bold">{{ $t('series_status_open') }} ({{ $t('series_status_until') }} {{ series.end | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY') }})</span>
        </v-card-text>
        <v-card-text v-else class="pa-0 ma-0" style="word-break: break-word;">
          <span>{{ $t('series_status') }}</span>
          <span class="font-weight-bold">{{ $t('series_status_closed') }}</span>
        </v-card-text>
        <v-card-text v-if="series" class="pa-0 ma-0" style="word-break: break-word;">
          <span>{{ $t('series_tag') }}</span>
          <span class="font-weight-bold">{{ series.tag }}</span>
        </v-card-text>
      </v-card>
    </v-list-item>
    <v-divider />
    <v-list-item v-if="full">
      <ogr-forum-series-parent-preview-chips
        :id="series.id"
        :parent-question="series.parentQuestion"
        :community-answers="communityAnswers"
        :expert-answers="expertAnswers"
        :series-children="seriesChildrenMin.length"
        :exam-mode="series.exam"
      />
      <v-spacer />
      <ogr-forum-series-parent-preview-buttons
        v-if="dashboard === false"
        :series="series"
      />
      <div v-else>
        <ogr-forum-button-with-tooltip
          v-if="series.exam"
          color="warning"
          :icon="mdiEyeCheck"
          :tooltip="$t('forum_tooltip_show').toString()"
          @click="$emit('click-series-show-children', series.id)"
        />
        <ogr-forum-button-with-tooltip
          v-if="seriesStatus"
          color="warning"
          :icon="mdiHandBackLeft"
          :tooltip="$t('forum_tooltip_stop').toString()"
          @click="$emit('click-series-close', series.id)"
        />
      </div>
    </v-list-item>
    <div v-else>
      <v-list-item>
        <ogr-forum-series-parent-preview-chips
          :id="series.id"
          :parent-question="series.parentQuestion"
          :community-answers="communityAnswers"
          :expert-answers="expertAnswers"
          :series-children="seriesChildrenMin.length"
          :exam-mode="series.exam"
        />
        <v-spacer />
      </v-list-item>
      <v-list-item>
        <v-spacer />
        <ogr-forum-series-parent-preview-buttons
          v-if="dashboard === false"
          :series="series"
        />
        <div v-else>
          <ogr-forum-button-with-tooltip
            v-if="series.exam"
            color="warning"
            :icon="mdiEyeCheck"
            :tooltip="$t('forum_tooltip_show').toString()"
            @click="$emit('click-series-show-children', series.id)"
          />
          <ogr-forum-button-with-tooltip
            v-if="seriesStatus"
            color="warning"
            :icon="mdiHandBackLeft"
            :tooltip="$t('forum_tooltip_stop').toString()"
            @click="$emit('click-series-close', series.id)"
          />
        </div>
      </v-list-item>
    </div>
    <v-divider v-if="expand" />
    <slot v-if="expand"></slot>
  </v-card>
</template>

<script>
import { mdiOpenInNew, mdiMapSearch, mdiFormatListText, mdiMapPlus, mdiMapMinus, mdiMapMarkerMultiple, mdiSchool, mdiAccountGroup, mdiEyeCheck, mdiHandBackLeft } from '@mdi/js'
import { getCategoryFromCode } from '@/util/ogr-utils'
import { mapState } from 'vuex'
import questionSeriesChildrenMin from '~/apollo/queries/questionSeriesChildrenMin.gql'
import OgrForumSeriesParentPreviewChips from '@/components/ogr/forum/OgrForumSeriesParentPreviewChips'
import OgrForumSeriesParentPreviewButtons from '@/components/ogr/forum/OgrForumSeriesParentPreviewButtons'
import OgrForumButtonWithTooltip from '@/components/ogr/forum/OgrForumButtonWithTooltip'

export default {
  name: 'OgrForumSeriesParentPreview',
  components: { OgrForumButtonWithTooltip, OgrForumSeriesParentPreviewButtons, OgrForumSeriesParentPreviewChips },
  props: {
    series: {
      type: Object,
      required: true
    },
    expand: {
      type: Boolean,
      required: false,
      default: false
    },
    dashboard: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      mdiOpenInNew,
      mdiMapSearch,
      mdiFormatListText,
      mdiMapPlus,
      mdiMapMinus,
      mdiMapMarkerMultiple,
      mdiSchool,
      mdiAccountGroup,
      mdiEyeCheck,
      mdiHandBackLeft,
      elevation: 6,
      placeholder: '/img/ogr_placeholder_2.png',
      ogrApiUrl: this.$config.ogrApiUrl,
      ogrMapUrl: this.$config.ogrMapUrl,
      show: false,
      expertAnswers: 0,
      communityAnswers: 0,
      seriesChildrenMin: []
    }
  },

  computed: {
    ...mapState('ogr', ['selectedSeries']),
    seriesStatus () {
      return Date.now() < Date.parse(this.series.end)
    },
    full () {
      const width = window.innerWidth
      if (width > 960) {
        return width > 1576
      } else {
        return width > 640
      }
    }
  },

  watch: {
    series () {
      this.countAnswers()
    }
  },

  mounted () {
    this.countAnswers()
    this.getSeriesChildrenMin()
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
    classification (q) {
      return getCategoryFromCode(q.datastream.category, this.$i18n.locale)
    },
    small (url) {
      return url + '?size=small'
    },
    cutText (text, len) {
      if (text.length > len) {
        return text.substring(0, len) + '...'
      }
      return text.substring(0, len)
    },
    zoomToQuestion () {
      this.$nuxt.$emit('centerMap', this.series.parentQuestion.datastream.observedArea.coordinates)
      this.$nuxt.$emit('zoomToCoordinates', this.series.parentQuestion.datastream.observedArea.coordinates)
    },
    getSeriesChildrenMin () {
      this.$apollo.query({
        query: questionSeriesChildrenMin,
        variables: {
          id: this.series.id
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.seriesChildrenMin = response.data.questionSeriesChildren
      })
    },
    countAnswers () {
      let expertAnswers = 0
      let communityAnswers = 0

      for (const answer of this.series.parentQuestion.answers) {
        let isExpert = false
        for (const role of answer.user.roles) {
          if (role.name === 'ROLE_EXPERT') {
            isExpert = true
          }
        }

        if (isExpert) {
          expertAnswers += 1
        } else {
          communityAnswers += 1
        }
      }

      this.expertAnswers = expertAnswers
      this.communityAnswers = communityAnswers
    }
  }
}

</script>

<style scoped>
.disable-events {
  pointer-events: none
}
.cut-text
{
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
