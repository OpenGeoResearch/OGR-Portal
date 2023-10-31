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
  <v-sheet v-if="sortedSeries">
    <v-toolbar
      class="pa-0"
      color="info"
      dark
    >
      <v-spacer />
      <v-toolbar-title>{{ $t('series_parent_info_title') }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-list-item class="pa-0 ma-0">
      <v-switch
        style="justify-content: flex-start"
        class="pa-0 ma-0 ml-5"
        v-model="open"
        color="info"
        :label="$t('series_open_only')"
        hide-details
      ></v-switch>
      <v-spacer />
      <v-btn-toggle
        v-model="sortStrategy"
        class="d-flex justify-end mt-0 mr-1 mb-0 pb-0"
        color="primary"
        dense
        mandatory
      >
        <v-btn value="newest">
          {{$t('newest_questions')}}
        </v-btn>

        <v-btn value="oldest">
          {{$t('oldest_questions')}}
        </v-btn>

        <v-btn value="highestVoted">
          {{$t('top_questions')}}
        </v-btn>
      </v-btn-toggle>
    </v-list-item>
    <template v-for="q in sortedSeries">
      <ogr-forum-series-parent-preview
        v-if="q"
        :series="q"
        :key="q.id"
      >
      </ogr-forum-series-parent-preview>
    </template>
  </v-sheet>
</template>

<script>
import questionSeries from '~/apollo/queries/questionSeries.gql'
import OgrForumSeriesParentPreview from '../../components/ogr/forum/OgrForumSeriesParentPreview'

export default {
  components: { OgrForumSeriesParentPreview },
  data () {
    return {
      series: [],
      sortStrategy: 'highestVoted',
      open: false
    }
  },

  computed: {
    oldestSeriesFirst () {
      if (this.open) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.openSeries.sort((a, b) => new Date(a.parentQuestion.datastream.resultTime) - new Date(b.parentQuestion.datastream.resultTime))
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.series.sort((a, b) => new Date(a.parentQuestion.datastream.resultTime) - new Date(b.parentQuestion.datastream.resultTime))
    },
    newestSeriesFirst () {
      if (this.open) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.openSeries.sort((a, b) => new Date(a.parentQuestion.datastream.resultTime) - new Date(b.parentQuestion.datastream.resultTime)).reverse()
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.series.sort((a, b) => new Date(a.parentQuestion.datastream.resultTime) - new Date(b.parentQuestion.datastream.resultTime)).reverse()
    },
    highestVotedSeriesFirst () {
      if (this.open) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.openSeries.sort((a, b) => (b.parentQuestion.votes.upCount - b.parentQuestion.votes.downCount) - (a.parentQuestion.votes.upCount - a.parentQuestion.votes.downCount))
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.series.sort((a, b) => (b.parentQuestion.votes.upCount - b.parentQuestion.votes.downCount) - (a.parentQuestion.votes.upCount - a.parentQuestion.votes.downCount))
    },
    openSeries () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.series.filter((a) => Date.now() < Date.parse(a.end))
    },
    sortedSeries () {
      if (this.sortStrategy === 'highestVoted') {
        return this.highestVotedSeriesFirst
      } else if (this.sortStrategy === 'newest') {
        return this.newestSeriesFirst
      } else {
        return this.oldestSeriesFirst
      }
    }
  },

  mounted () {
    this.getSeries()
  },

  methods: {
    getSeries () {
      this.$apollo.query({
        query: questionSeries,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.series = response.data.questionSeries
      })
    }
  }
}
</script>
