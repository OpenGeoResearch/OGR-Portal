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
  <v-card v-if="questionsByCode">
    <v-toolbar
        color="primary"
        class="pa-0"
        dark
    >
      <v-row>
        <v-col cols="2"/>
        <v-col class="d-flex justify-space-around">
          <v-toolbar-title>{{classification(this.code)}}</v-toolbar-title>
        </v-col>
        <v-col
          cols="2"
          class="d-flex justify-end"
        >
        </v-col>
      </v-row>
    </v-toolbar>
    <template v-for="q in questionsByCode">
      <ogr-question-card
        v-if="q"
        :key="q.id"
        :question="q"
        activate-votes="false"
      >
      </ogr-question-card>
    </template>
  </v-card>
</template>

<script>

import gql from 'graphql-tag'
import OgrQuestionCard from '@/components/ogr/comments/OgrQuestionCard'
import { getCategoryFromCode } from '@/util/ogr-utils'
export default {
  components: { OgrQuestionCard },
  data: function () {
    return {
      code: this.$route.params.code
    }
  },

  apollo: {
    questionsByCode: {
      query: gql`query QuestionsByCode ($code: String!) {
                            questionsByCode (code: $code) {
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
        return { code: this.code }
      }
    }
  },

  mounted () {
    $nuxt.$emit('unselectAll')
    this.$store.commit('ogr/setCategory', this.$route.params.code)
    $nuxt.$emit('updateLayer', 'OGR')
  },
  methods: {
    classification (q) {
      return getCategoryFromCode(q, this.$i18n.locale)
    }
  }
}

</script>

<style scoped>

</style>
