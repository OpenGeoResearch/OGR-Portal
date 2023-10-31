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
    class="cut-text ma-1"
    outlined
    :to="`/question/${this.question.id}`"
    :class="`elevation-${this.elevation}`"
    @mouseover="raiseElevation"
    @mouseleave="resetElevation"
  >
    <v-list-item>
      <v-list-item-avatar
        size="150"
        tile
      >
        <v-img
          v-if="this.question.datastream.images[0]"
          :lazy-src="placeholder"
          :src="small(this.question.datastream.images[0])"
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
          <nuxt-link :to="'/question/' + question.id">
            {{this.question.datastream.name}} test123
          </nuxt-link>
        </v-list-item-title>
        <v-list-item-group>
          <v-btn
            color="green"
            icon
            x-small
          >
            <v-icon small>
              mdi-chevron-up
            </v-icon>
            {{this.question.votes.upCount}}
          </v-btn>
          <v-btn
            color="red"
            icon
            x-small
          >
            <v-icon small>
              mdi-chevron-down
            </v-icon>
            {{this.question.votes.downCount}}
          </v-btn>
          <v-chip
            class="disable-events ml-1"
            x-small
          >
            {{ this.question.datastream.resultTime | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
          </v-chip>
          <v-chip
            class="disable-events"
            color="lime accent-4"
            pill
            x-small
            label
          >
            <span class="text-truncate">
              {{classification(this.question)}}
            </span>
          </v-chip>
        </v-list-item-group>
        <v-list-item-content>
          {{this.question.datastream.description}}
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import user from '~/apollo/queries/user'
import { getCategoryFromCode } from '@/util/ogr-utils'

export default {
  name: 'OgrQuestionCard',
  props: {
    question: Object,
    activateVotes: Boolean
  },

  data: function () {
    return {
      elevation: 6,
      placeholder: '/img/ogr_placeholder_2.png',
      ogrApiUrl: this.$config.ogrApiUrl
    }
  },

  computed: {
    loggedIn () {
      return this.$auth.loggedIn
    },
    // eslint-disable-next-line vue/return-in-computed-property
    images () {
      if (!this.question.datastream.images) {
        return this.question.properties.images[0]
      }
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
      // eslint-disable-next-line no-undef
      $nuxt.$emit('updateLayer', 'OGR')
    },
    small (url) {
      return url + '?size=small'
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
