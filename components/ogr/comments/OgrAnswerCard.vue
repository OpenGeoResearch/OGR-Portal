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
  <v-container class="pa-1">
    <v-card
      class="cut-text"
      outlined
      height="150"
      :to="`/question/${this.answer.question.id}`"
      :class="`elevation-${this.elevation}`"
      @mouseover="raiseElevation"
      @mouseleave="resetElevation"
    >
      <v-row>
        <v-avatar
          size="170"
          tile
        >
          <v-img
            v-if="this.answer.question.datastream.images[0]"
            :lazy-src="placeholder"
            :src="this.answer.question.datastream.images[0]"
            height="150"
            max-width="150"
          >
          </v-img>
          <v-img
            v-else
            :src="this.placeholder"
            height="150"
            max-width="150"
          >
          </v-img>
        </v-avatar>
        <v-col class="pa-0 ml-n3">
          <v-card-subtitle class="pb-0">
            <nuxt-link :to="`/question/${this.answer.question.id}`">
              {{this.answer.question.datastream.name}}
            </nuxt-link>
          </v-card-subtitle>
          <v-card-text class="pt-0">
            <v-btn
              color="green"
              icon
              x-small
            >
              <v-icon x-small>
                mdi-chevron-up
              </v-icon>
              {{this.answer.question.votes.upCount}}
            </v-btn>
            <v-btn
              color="red"
              icon
              x-small
            >
              <v-icon x-small>
                mdi-chevron-up
              </v-icon>
              {{this.answer.question.votes.downCount}}
            </v-btn>
            <v-chip
              x-small
              class="disable-events"
            >
              {{ this.answer.question.datastream.resultTime | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
            </v-chip>
            <v-chip
              class="disable-events"
              pill
              x-small
              color="lime accent-4"
                label
            >
              {{classification(this.answer.question)}}
            </v-chip>
          </v-card-text>
          <v-card-text class="mt-n8">
            {{this.answer.question.datastream.description}}
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import user from '~/apollo/queries/user'
import { getCategoryFromCode } from '@/util/ogr-utils'

export default {
  name: 'OgrAnswerCard',
  props: {
    answer: Object,
    activateVotes: Boolean
  },
  data: function () {
    return {
      elevation: 6,
      placeholder: '/img/ogr_placeholder_2.png'
    }
  },

  computed: {
    loggedIn () {
      return this.$auth.loggedIn
    }
  },

  apollo: {
    user: {
      query: user,
      prefetch: true,
      variables () {
        return { username: this.$route.params.username }
      }
    }
  },

  beforeRouteLeave (to, from, next) {
    this.$store.commit('ogr/removeQuestionIds')
    next()
  },

  methods: {
    raiseElevation () {
      this.elevation = 20
    },

    resetElevation () {
      this.elevation = 6
    },

    classification (q) {
      return getCategoryFromCode(q.datastream.category, this.$i18n.locale)
    },
    selectCategory (item) {
      this.$store.commit('ogr/setCategory', item)
      // eslint-disable-next-line
      $nuxt.$emit('updateLayer', 'OGR')
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
