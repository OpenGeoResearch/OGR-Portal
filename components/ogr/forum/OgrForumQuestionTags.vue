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
  <div>
    <div class="text-left" >
      <template v-for="(tag) in semanticTags">
        <template v-if="filteredTags.indexOf(tag.result) >= 0">
          <v-chip
            :key="tag.result"
            class="mt-1 mr-4"
            :color="isSeriesTag(tag) ? 'info' : 'primary'"
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
            class="mt-1 mr-4"
            :color="isSeriesTag(tag) ? 'info' : 'primary'"
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

    <div class="text-left" >
      <template v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EDITOR')">
        <v-chip
          v-for="(tag) in functionalTags"
          :key="tag.result"
          class="mt-1 mr-4"
          color="info"
          outlined
          pill
          small
        >
          {{tag.result}}
        </v-chip>
      </template>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  props: {
    semanticTags: {
      type: Array,
      required: true
    },
    functionalTags: {
      type: Array,
      required: true
    }
  },

  data () {
    return {

    }
  },

  computed: {
    ...mapState('ogr', ['filteredTags'])
  },

  methods: {
    isSeriesTag (tag) {
      return tag.result.substring(0, 2) === 's_'
    },
    filterForTag (tag) {
      // alert("Filtering for tag: " + tag)
      if (this.filteredTags.indexOf(tag) >= 0) {
        this.$store.commit('ogr/removeTag', tag)
      } else {
        this.$store.commit('ogr/addTag', tag)
      }
      // eslint-disable-next-line no-undef
      this.$nuxt.$emit('updateLayer', 'OGR')
      this.$nuxt.$emit('updateLayer', 'OGR_Cluster')
    }
  }
}
</script>
