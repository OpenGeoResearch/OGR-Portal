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
  <div v-if="!unansweredQuestions">
    <v-skeleton-loader class="mb-3" type="article" elevation="2" v-for="n in 10" :key="n"></v-skeleton-loader>
  </div>
  <v-card v-else-if="unansweredQuestions">
    <v-toolbar
      class="pa-0"
      color="primary"
      dark
    >
      <v-row>
        <v-col cols="2"></v-col>
        <v-col class="d-flex justify-space-around">
          <v-toolbar-title>{{$t('unanswered_questions')}}</v-toolbar-title>
        </v-col>
        <v-col
          cols="2"
          class="d-flex justify-end"
        >
        </v-col>
      </v-row>
    </v-toolbar>
    <v-list-item class="pa-0 ma-0 mb-1">
      <v-spacer />
      <v-btn-toggle
        v-model="sortStrategy"
        class="d-flex justify-end mt-0 mr-1 mb-0 pb-0"
        color="primary"
        dense
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
    <template v-for="q in questions">
      <ogr-forum-question-preview
        v-if="q"
        :question="q"
        :key="q.id"
      >
      </ogr-forum-question-preview>
    </template>
  </v-card>
</template>

<script>
import unansweredQuestions from '~/apollo/queries/unansweredQuestions.gql'
import OgrForumQuestionPreview from '../../components/ogr/forum/OgrForumQuestionPreview'

export default {
  components: { OgrForumQuestionPreview },

  data: function () {
    return {
      sortStrategy: 'newest'
    }
  },

  computed: {
    oldestQuestionsFirst () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.unansweredQuestions.sort((a, b) => new Date(a.datastream.resultTime) - new Date(b.datastream.resultTime))
    },
    newestQuestionsFirst () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.unansweredQuestions.sort((a, b) => new Date(a.datastream.resultTime) - new Date(b.datastream.resultTime)).reverse()
    },
    highestVotedQuestionsFirst () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.unansweredQuestions.sort((a, b) => b.votes.upCount - a.votes.upCount)
    },
    questions () {
      if (this.sortStrategy === 'highestVoted') {
        return this.highestVotedQuestionsFirst
      } else if (this.sortStrategy === 'newest') {
        return this.newestQuestionsFirst
      } else {
        return this.oldestQuestionsFirst
      }
    }
  },

  apollo: {
    unansweredQuestions: {
      query: unansweredQuestions,
      prefetch: true,
      variables () {
        return {
          size: 30
        }
      }
    }
  },

  beforeRouteLeave (to, from, next) {
    this.$store.commit('ogr/removeQuestionIds')
    this.$nuxt.$emit('updateLayer', 'OGR')
    this.$nuxt.$emit('updateLayer', 'OGR_Cluster')
    next()
  },

  watch: {
    unansweredQuestions () {
      this.$store.commit('ogr/resetFilters')
      this.$store.commit('ogr/setQuestionIds', this.unansweredQuestions.map(question => question.id))
      this.$nuxt.$once('mapinitcomplete', () => {
        setTimeout(() => this.$nuxt.$emit('updateLayer', 'OGR'), 500)
      })
      this.$nuxt.$emit('updateLayer', 'OGR', true)
      this.$nuxt.$emit('updateLayer', 'OGR_Cluster', true)
    }
  }
}

</script>
