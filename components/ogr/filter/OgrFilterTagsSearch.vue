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
  <v-autocomplete
    :items="tags"
    :loading="isLoading"
    :search-input.sync="search"
    :value="filteredTags"
    placeholder="Add Tags"
    label="Tags filter"
    chips
    multiple
    @input="addTag($event)"
  >
    <template v-slot:item="{item}">
      <v-list-item-content v-text="item"></v-list-item-content>
    </template>
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="removeTag(data.item)"
      >
          {{ data.item }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OgrFilterTagsSearch',

  components: {

  },
  data: function () {
    return {
      search: null,
      isLoading: false,
      tags: ['hang', 'erosion', 'Archäologie'],
      selectedTags: []
    }
  },
  computed: {
    ...mapState('ogr', ['filteredTags'])
  },
  methods: {
    addTag (tags) {
      const tag = tags[tags.length - 1]
      if (tag !== undefined && this.filteredTags.indexOf(tag) === -1) {
        this.$store.commit('ogr/addTag', tags[tags.length - 1])
        /* eslint-disable */
        $nuxt.$emit('updateLayer', 'OGR')
        $nuxt.$emit('updateLayer', 'OGR_Cluster')
      }
    },
    removeTag (tag) {
      this.$store.commit('ogr/removeTag', tag)
      $nuxt.$emit('updateLayer', 'OGR')
      $nuxt.$emit('updateLayer', 'OGR_Cluster')
      /* eslint-enable */
    }
  }
}
</script>

<style scoped>

</style>
