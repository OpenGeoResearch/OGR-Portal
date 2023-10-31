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
      class="mx-auto my-12"
      max-width="800"
  >
    <v-carousel height="300">
      <v-carousel-item
        v-for="(image) in images"
        :key="image"
      >
        <v-img
          :src="image"
          contain
        >
        </v-img>
      </v-carousel-item>
        <v-carousel-item
          v-for="(audio) in audios"
          :key="audio"
        >
          <v-img
            :src="audio"
            contain
          >
          </v-img>
        </v-carousel-item>
        <v-carousel-item
          v-for="(video) in videos"
          :key="video"
        >
          <v-img
            :src="video"
            contain
          >
          </v-img>
        </v-carousel-item>
    </v-carousel>

    <v-card-title>{{datastream.name}}</v-card-title>
    <v-card-text>
      <v-chip
          class="ma-2"
          small
      >
        <v-icon left>
          mdi-calendar
        </v-icon>
        {{datastream.resultTime}}
      </v-chip>
      <v-chip
        class="ma-2"
        small
      >
        <v-icon left>
          mdi-account
        </v-icon>
        {{username}}
      </v-chip>
    </v-card-text>

    <v-card-text>
      <div
        class="my-4
        subtitle-1"
      >
        {{classification}}
      </div>
      <div>{{datastream.description}}</div>
  </v-card-text>

    <v-divider class="mt-6 mx-4"></v-divider>

    <v-card-text>
      <div class="text-left">
        <template v-for="(tag) in tags">
          <template v-if="filteredTags.indexOf(tag.result) >= 0">
            <v-chip
              :key="tag.result"
              class="ma-2"
              color="primary"
              pill
              small
              @click="filterForTag(tag.result)"
            >
              {{tag.result}}
            </v-chip>
          </template>
            <template v-else>
              <v-chip
                :key="tag.result"
                class="ma-2"
                color="primary"
                outlined
                pill
                small
                @click="filterForTag(tag.result)"
              >
                {{tag.result}}
              </v-chip>
            </template>
        </template>
      </div>
    </v-card-text>
    <v-card-text>
      <div class="text-right" >
        <nuxt-link :to="`question/${datastream['@iot.id']}`">
          See details
        </nuxt-link>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { getCategoryFromCode } from '@/util/ogr-utils.js'

export default {
  props: {
    feature: Object
  },
  data: function () {
    return {
      datastream: {
        properties: {
          name: 'test',
          description: 'test'
        }
      },
      date: '2020-10-20T10:00Z',
      username: 'Naturbursche',
      tags: []
    }
  },
  computed: {
    ...mapState('ogr', ['filteredTags']),
    classification () {
      if (this.datastream && this.datastream.unitOfMeasurement !== undefined) {
        return getCategoryFromCode(this.datastream.unitOfMeasurement.symbol)
      } else {
        return undefined
      }
    },
    images () {
      return this.datastream.properties.images
    },
    audios () {
      return this.datastream.properties.audios
    },
    videos () {
      return this.datastream.properties.videos
    }
  },

  mounted () {
    this.loadData()
  },
  watch: {
    feature () {
      this.loadData()
    },

    datastream () {
      // load tags
      axios.get(this.datastream['Observations@iot.navigationLink'])
        .then(response => (this.tags = response.data.value))
      this.$store.commit('ogr/setSelectedQuestion', this.datastream)
    }
  },
  methods: {
    filterForTag (tag) {
      // alert("Filtering for tag: " + tag)
      if (this.filteredTags.indexOf(tag) >= 0) {
        this.$store.commit('ogr/removeTag', tag)
      } else {
        this.$store.commit('ogr/addTag', tag)
      }
      /* eslint-disable-next-line */
      $nuxt.$emit('updateLayer', 'OGR')
    },
    loadData () {
      axios.get(this.feature.properties['@iot.selfLink'])
        .then(response => {
          this.datastream = response.data
          /* eslint-disable-next-line */
          $nuxt.$emit('centerMap', this.datastream.observedArea.coordinates)
        })
    }
  }
}
</script>

<style scoped>

</style>
