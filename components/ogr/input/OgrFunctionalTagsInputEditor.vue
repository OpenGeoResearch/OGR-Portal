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
    <v-card-title>{{ $t('input_functional_tags_title') }}</v-card-title>
    <v-card-text>
      <v-subheader class="pl-0 mt-0 mb-0 pb-0">
        {{ $t('input_functional_tags_subheader_current') }}
      </v-subheader>
      <v-row no-gutters>
        <v-chip
          class="mt-0 mr-1"
          v-for="(tag, i) in functionalTags"
          :key="tag + i"
          small
          outlined
          color="info"
        >
          {{ tag.result }}
        </v-chip>
      </v-row>

      <v-divider class="mt-4" />

      <v-subheader class="pl-0 mt-2">
        {{ $t('input_functional_tags_subheader_legend') }}
      </v-subheader>

      <v-row no-gutters>
        <v-col cols="3">
          <span class="font-weight-bold">answered-comm</span><br>
          <span class="font-weight-bold">answered-exp</span><br>
          <span class="font-weight-bold">unanswered-comm</span><br>
          <span class="font-weight-bold">unanswered-exp</span><br>
          <span class="font-weight-bold">needs-review</span><br>
          <span class="font-weight-bold">handled</span><br>
          <span class="font-weight-bold">potential</span><br>
          <span class="font-weight-bold">edited</span><br>
          <span class="font-weight-bold">exp-inquired</span><br>
          <span class="font-weight-bold">closed</span>
        </v-col>
        <v-col cols="9">
          <span>Antwort aus Community vorhanden</span><br>
          <span>Antwort von ExpertIn vorhanden</span><br>
          <span>Keine Antwort aus Community vorhanden</span><br>
          <span>Keine Antwort von ExpertIn vorhanden</span><br>
          <span>Muss bearbeitet werden</span><br>
          <span>Funktionale Tags wurden gesetzt</span><br>
          <span>Als interessant markiert</span><br>
          <span>Inhalte der Frage wurden bearbeitet</span><br>
          <span>ExpertIn wurde angefragt</span><br>
          <span>Es können keine Antworten mehr hinzugefügt werden</span>
        </v-col>
      </v-row>

      <v-divider class="mt-4" />

      <v-subheader class="pl-0 mt-2">
        {{ $t('input_functional_tags_subheader_edit') }}
      </v-subheader>

      <v-select
        v-model="tags"
        :items="items"
        dense
        outlined
        small-chips
        :label="$t('input_functional_tags_text_unset')"
        placeholder=""
        multiple
      ></v-select>

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
          @click="setTags"
      >
        {{ $t('input_functional_tags_submit') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'OgrFunctionalTagsInputEditor',

  props: {
    id: {
      type: Number,
      required: true,
      default: null
    },
    functionalTags: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },

  data () {
    return {
      ogrApiUrl: this.$config.ogrApiUrl,
      tags: [],
      items: ['answered-comm', 'answered-exp', 'unanswered-comm', 'unanswered-exp', 'edited', 'needs-review', 'handled', 'closed', 'potential', 'exp-inquired']
    }
  },

  computed: {
    ...mapState('ogr', ['selectedQuestion'])
  },

  mounted () {
    this.tags = []
    for (let i = 0; i < this.functionalTags.length; i++) {
      this.tags.push(this.functionalTags[i].result)
    }
    if (!this.tags.includes('handled')) {
      this.tags.push('handled')
    }
  },

  methods: {
    setTags () {
      const config = this.createConfig('application/json')

      const request = { datastreamId: this.id, functionalTags: this.tags }

      axios.post(this.ogrApiUrl + '/ogr/setFunctionalTags', request, config)
        .then((response) => {
          if (response.status === 200) {
            this.$emit('update-functional-tags')
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
    }
  }
}
</script>

<style scoped>
.v-select__selections {
  text-transform: lowercase;
}
</style>
