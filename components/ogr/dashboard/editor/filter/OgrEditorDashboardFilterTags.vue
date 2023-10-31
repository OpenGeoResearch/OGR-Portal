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
  <v-card class="mx-2" height="450px">
    <v-card-title>Tags</v-card-title>
    <v-card-actions>
      <v-combobox
        :items="items"
        v-model="selectedTags"
        :loading = "isLoading"
        :search-input.sync="search"
        :delimiters="delimiters"
        :label="$t('ogr_filter_add_tags')"
        hint="Maximal 5 Tags"
        placeholder=""
        outlined
        dense
        hide-selected
        multiple
        hide-details
        small-chips
        deletable-chips
        autofocus
      />
    </v-card-actions>
    <v-card-subtitle>Top Tags</v-card-subtitle>
    <v-card-actions>
      <div class="text-left" >
        <template v-for="(tag) in topTags" >
          <template>
            <v-chip
              :key="tag[0]"
              class="ma-2"
              color="primary"
              :outlined="selectedTags.indexOf(tag[0]) < 0"
              pill
              small
              @click="updateSelectedTags(tag[0])"
            >
              {{tag[0]}}
              <v-avatar
                :class="selectedTags.indexOf(tag[0]) >= 0 ? 'secondary' : 'primary'"
                right
              >
                <span class="white--text">
                  {{tag[1]}}
                </span>
              </v-avatar>
            </v-chip>
          </template>
        </template>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'OgrEditorDashboardFilterTags',

  data: function () {
    return {
      search: null,
      isLoading: false,
      delimiters: [',', ' '],
      items: [],
      topTags: []
    }
  },

  async fetch () {
    this.topTags = await this.$axios.get('/ogr/toptags')
      .then(res => res.data)
  },

  watch: {
    search (val) {
      if (val == null) { return }
      if (this.isLoading) { return }

      if (val.length >= 3) {
        this.isLoading = true
        this.$axios.get('/ogr/tags?query=' + val)
          .then((response) => {
            this.items = response.data
            this.isLoading = false
          })
      } else {
        this.items = []
      }
    }
  },

  computed: {
    selectedTags: {
      get: function () {
        return this.$store.state['editor-dashboard'].filter.tags
      },
      set: function (value) {
        this.$store.commit('editor-dashboard/setTags', value)
      }
    }
  },

  methods: {
    updateSelectedTags (tag) {
      if (!this.selectedTags.includes(tag)) {
        this.$store.commit('editor-dashboard/addTag', tag)
      } else {
        this.$store.commit('editor-dashboard/removeTag', tag)
      }
    }
  }
}
</script>

<style scoped>

</style>
