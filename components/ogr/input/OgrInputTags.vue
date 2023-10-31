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
  <v-combobox
    v-model="tags"
    class="tags"
    :loading="isLoading"
    :search-input.sync="search"
    :delimiters="delimiters"
    :items="items"
    counter="5"
    outlined
    dense
    :hint="$t('input_tags_hint')"
    :label="$t('input_tags_text_unset')"
    placeholder=""
    multiple
    small-chips
    deletable-chips
    @change="updateTags"
  />
</template>

<script>

export default {
  name: 'OgrInputTags',

  data: () => ({
    search: null,
    isLoading: false,
    delimiters: [',', ' '],
    tags: [],
    items: []
  }),

  watch: {
    tags (val) {
      if (this.isLoading) {
        this.isLoading = false
        this.search = ''
      }
      if (val.length > 5) {
        this.$nextTick(() => this.tags.pop())
      }
    },
    search (val) {
      if (val == null) { return }
      if (this.isLoading) { return }

      if (val.length >= 3) {
        this.isLoading = true
        this.$axios.get('/ogr/tags?query=' + val)
          .then((response) => {
            this.items = response.data
          })
      }
    }
  },

  methods: {
    updateTags () {
      this.$emit('input', this.tags.map(v => v.toLowerCase()))
    }
  }
}
</script>

<style>
.v-select__selections {
  text-transform: lowercase;
}
</style>
