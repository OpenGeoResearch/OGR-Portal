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
  <div v-if="!worstVotedQuestions">
    <v-skeleton-loader class="mb-3" type="article" elevation="2" v-for="n in 10" :key="n"></v-skeleton-loader>
  </div>
  <v-card v-else-if="worstVotedQuestions">
    <v-toolbar
      class="pa-0"
      color="primary"
      dark
    >
      <v-row>
        <v-col cols="2"></v-col>
        <v-col class="d-flex justify-space-around">
          <v-toolbar-title>{{$t('worst_questions')}}</v-toolbar-title>
        </v-col>
        <v-col
          cols="2"
          class="d-flex justify-end"
        >
        </v-col>
      </v-row>
    </v-toolbar>
    <template v-for="q in worstVotedQuestions">
      <ogr-question-card
        v-if="q"
        :question="q"
        :activate-votes="false"
        :key="q.id"
      >
      </ogr-question-card>
    </template>
  </v-card>
</template>

<script>

import gql from 'graphql-tag'

export default {
  components: {},

  data: function () {
    return {
    }
  },

  apollo: {
    worstVotedQuestions: {
      query: gql`query WorstVotedQuestions($size: Int!) {
                            worstVotedQuestions(size: $size) {
                                id
                                votes {
                                  upCount
                                  downCount
                                }
                                datastream {
                                    name
                                    description
                                    resultTime
                                    images
                                    category
                                }
                            }
                        }`,
      prefetch: true,
      variables () {
        return { size: 10 }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('ogr/removeQuestionIds')
    /* eslint-disable */
    $nuxt.$emit('updateLayer', 'OGR')
    $nuxt.$emit('updateLayer', 'OGR_Cluster')
    /* eslint-disable */
    next()
  },

  watch: {
    worstVotedQuestions () {
      this.$store.commit('ogr/resetFilters')
      this.$store.commit('ogr/setQuestionIds', this.worstVotedQuestions.map(question => question.id))
      this.$nuxt.$once('mapinitcomplete', () => {
        // eslint-disable-next-line no-undef
        setTimeout(() => $nuxt.$emit('updateLayer', 'OGR'), 500)
      })
      // eslint-disable-next-line no-undef
      $nuxt.$emit('updateLayer', 'OGR', true)
      $nuxt.$emit('updateLayer', 'OGR_Cluster', true)
    }
  }
}

</script>

<style scoped>

</style>
