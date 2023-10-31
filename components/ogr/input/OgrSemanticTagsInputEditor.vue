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
  <v-card height="80vh">
    <v-card-title>{{ $t('input_semantic_tags_title') }}</v-card-title>
    <v-card-text>
      <v-subheader class="pl-0 mt-0 mb-0 pb-0">
        {{ $t('input_semantic_tags_subheader_current') }}
      </v-subheader>
      <v-row no-gutters>
        <v-chip
          class="mt-0 mr-1"
          v-for="(tag, i) in semanticTags"
          :key="tag + i"
          small
          outlined
          color="primary"
        >
          {{ tag.result }}
        </v-chip>
      </v-row>

      <v-divider class="mt-4" />

      <v-subheader class="pl-0 mt-2">
        {{ $t('input_semantic_tags_subheader_edit') }}
      </v-subheader>

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
        :hint="$t('input_semantic_tags_hint')"
        :label="$t('input_semantic_tags_text_unset')"
        placeholder=""
        multiple
        small-chips
        deletable-chips
        autofocus
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
          @click="$emit('click-abort')"
      >
        {{ $t('general_abort') }}
      </v-btn>
      <v-btn
          color="secondary"
          @click="addTags"
      >
        {{ $t('input_semantic_tags_submit') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'OgrSemanticTagsInputEditor',

  props: {
    id: {
      type: Number,
      required: true,
      default: null
    },
    semanticTags: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },

  data () {
    return {
      ogrApiUrl: this.$config.ogrApiUrl,
      search: null,
      isLoading: false,
      delimiters: [',', ' '],
      tags: [],
      items: []
    }
  },

  computed: {
    ...mapState('ogr', ['selectedQuestion'])
  },

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
        this.$axios.get(this.ogrApiUrl + '/ogr/tags?query=' + val)
          .then((response) => {
            this.items = response.data
          })
      }
    }
  },

  methods: {
    addTags () {
      const config = this.createConfig('application/json')

      const request = { datastreamId: this.id, semanticTags: this.tags }

      axios.post(this.ogrApiUrl + '/ogr/addSemanticTags', request, config)
        .then((response) => {
          if (response.status === 200) {
            this.setEdited()
            this.$emit('update-semantic-tags')
          }
        })
        .catch(() => {})
    },
    createConfig (type) {
      if (this.$auth.getToken('local')) {
        return { headers: { 'Content-Type': type, Authorization: this.$auth.getToken('local') } }
      } else {
        return { headers: { 'Content-Type': type } }
      }
    },
    setEdited () {
      const config = this.createConfig('application/json')
      const request = { datastreamId: this.id, functionalTag: 'edited' }
      axios.post(this.ogrApiUrl + '/ogr/addFunctionalTag', request, config)
        .then((response) => {
          if (response.status === 200) {
            this.$emit('update-functional-tags')
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.v-select__selections {
  text-transform: lowercase;
}
</style>
