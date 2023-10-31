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
  <div v-if="!newestQuestions">
    <v-skeleton-loader class="mb-3" type="article" elevation="2" v-for="n in 10" :key="n"></v-skeleton-loader>
  </div>
  <v-sheet v-else-if="newestQuestions">
    <v-toolbar
      class="pa-0"
      color="primary"
      dark
    >
      <v-row>
        <v-col cols="2"></v-col>
        <v-col class="d-flex justify-space-around">
          <v-toolbar-title>{{$t('newest_questions') | capitalize}}</v-toolbar-title>
        </v-col>
        <v-col
          cols="2"
          class="d-flex justify-end"
        >
        </v-col>
      </v-row>
    </v-toolbar>
    <template v-for="q in newestQuestions">
      <ogr-forum-question-preview
        v-if="q"
        :question="q"
        :key="q.id"
      >
      </ogr-forum-question-preview>
    </template>
  </v-sheet>
</template>

<script>
import newestQuestions from '~/apollo/queries/newestQuestions.gql'
import OgrForumQuestionPreview from '../../components/ogr/forum/OgrForumQuestionPreview'

export default {
  components: { OgrForumQuestionPreview },

  data: function () {
    return {

    }
  },

  apollo: {
    newestQuestions: {
      query: newestQuestions,
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
    newestQuestions () {
      this.$store.commit('ogr/resetFilters')
      this.$store.commit('ogr/showQuestionIds')
      this.$store.commit('ogr/setQuestionIds', this.newestQuestions.map(question => question.id))
      this.$store.commit('ogr/showQuestionIds')
      this.$nuxt.$once('mapinitcomplete', () => {
        setTimeout(() => this.$nuxt.$emit('updateLayer', 'OGR'), 500)
      })
      this.$nuxt.$emit('updateLayer', 'OGR', true)
      this.$nuxt.$emit('updateLayer', 'OGR_Cluster', true)
    }
  }
}

</script>
