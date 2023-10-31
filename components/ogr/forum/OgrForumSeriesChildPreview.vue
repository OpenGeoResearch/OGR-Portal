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
    <v-list-item
      :to="'/question/' + question.id"
      :target="dashboard ? '_blank' : '_self'"
    >
      <v-list-item-avatar
        size="150"
        tile
      >
        <v-img
          v-if="question.datastream.images.length > 0"
          :lazy-src="placeholder"
          :src="small(question.datastream.images[0])"
        >
        </v-img>
        <v-img
          v-else
          :src="placeholder"
        >
        </v-img>
      </v-list-item-avatar>

      <v-list-item-content style="align-self: baseline;">
        <v-list-item-title>
          <v-chip
            class="disable-events mr-2"
            label
            x-small
            color="info"
          >
            {{ seriesData.tag }}
          </v-chip>
        </v-list-item-title>
        <v-list-item-title class="text-h6">
          {{question.datastream.name}}
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
              {{classification(question)}}
            </span>
          </v-chip>
          <v-chip
            class="disable-events"
            x-small
          >
            {{ question.datastream.resultTime | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
          </v-chip>
          <v-chip
            v-if="dashboard && question.user"
            class="disable-events"
            x-small
          >
            <v-icon
              left
              small
            >
              {{ mdiAccount }}
            </v-icon>
            {{ question.user.username }}
          </v-chip>
        </v-list-item-group>
        <v-list-item-content>
          {{ cutText(question.datastream.description, 150) }}
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list-item>
      <ogr-forum-chip-votes
        :id="question.id"
        post-type="POST_TYPE_QUESTION"
        :up="question.votes.upCount"
        :down="question.votes.downCount"
      />
      <ogr-forum-chip-number
        :icon="mdiSchool"
        :value="expertAnswers"
        :primary="'primary'"
        :secondary="'secondary'"
        :tooltip="$t('forum_tooltip_answers_expert').toString()"
      />
      <ogr-forum-chip-number
        :icon="mdiAccountGroup"
        :value="communityAnswers"
        :primary="'primary'"
        :secondary="'secondary'"
        :tooltip="$t('forum_tooltip_answers_community').toString()"
      />
      <v-spacer />
      <div v-if="dashboard === false">
        <ogr-forum-button-with-tooltip
          v-if="selectedSeries !== seriesData.tag"
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
          v-if="question.id"
          color="secondary"
          :icon="mdiMapSearch"
          :tooltip="$t('forum_tooltip_zoom_to_question').toString()"
          @click="zoomToQuestion"
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="question.id"
              color="external"
              :href="ogrMapUrl + '/question/' + question.id"
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
      <div v-else>
        <ogr-forum-button-with-tooltip
          v-if="!question.hidden"
          color="warning"
          :icon="mdiEyeOff"
          :tooltip="$t('forum_tooltip_delete_series_child').toString()"
          @click="$emit('click-delete-series-child', question.id)"
        />
      </div>
    </v-list-item>
  </v-card>
</template>

<script>
import { mdiOpenInNew, mdiMapSearch, mdiFormatListText, mdiMapPlus, mdiMapMinus, mdiSchool, mdiAccountGroup, mdiEyeOff, mdiAccount } from '@mdi/js'
import { getCategoryFromCode } from '@/util/ogr-utils'
import OgrForumChipVotes from './OgrForumChipVotes'
import OgrForumButtonWithTooltip from './OgrForumButtonWithTooltip'
import { mapState } from 'vuex'
import OgrForumChipNumber from '@/components/ogr/forum/OgrForumChipNumber'

export default {
  name: 'OgrForumSeriesChildPreview',
  components: { OgrForumChipNumber, OgrForumButtonWithTooltip, OgrForumChipVotes },
  props: {
    question: {
      type: Object,
      required: true
    },
    seriesData: {
      type: Object,
      required: true
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
      mdiSchool,
      mdiAccountGroup,
      mdiEyeOff,
      mdiAccount,
      elevation: 6,
      placeholder: '/img/ogr_placeholder_2.png',
      ogrApiUrl: this.$config.ogrApiUrl,
      ogrMapUrl: this.$config.ogrMapUrl,
      show: false,
      expertAnswers: 0,
      communityAnswers: 0
    }
  },

  computed: {
    ...mapState('ogr', ['selectedSeries'])
  },

  mounted () {
    this.countAnswers()
  },

  methods: {
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
      this.$nuxt.$emit('centerMap', this.question.datastream.observedArea.coordinates)
      this.$nuxt.$emit('zoomToCoordinates', this.question.datastream.observedArea.coordinates)
    },
    countAnswers () {
      let expertAnswers = 0
      let communityAnswers = 0

      if (this.question.answers) {
        for (const answer of this.question.answers) {
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
      }

      this.expertAnswers = expertAnswers
      this.communityAnswers = communityAnswers
    },
    showSeriesLayers () {
      if (this.seriesData.tag !== '') {
        // this.$store.commit('ogr/resetFilters')
        this.$store.commit('ogr/addTag', this.seriesData.tag)
        this.$store.commit('ogr/setSelectedSeries', this.seriesData.tag)
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
      if (this.seriesData.tag !== '') {
        this.$store.commit('ogr/removeTag', this.seriesData.tag)
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
