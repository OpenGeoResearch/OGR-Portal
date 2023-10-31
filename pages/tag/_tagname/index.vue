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
  <div class="pa-10">
    <v-card v-if="questions">
      <v-card-subtitle>Questions:</v-card-subtitle>
      <template v-for="q in questions">
        <v-card-text>
          <nuxt-link :to="`/question/${q['@iot.id']}`">
            {{q.name}}
          </nuxt-link>
        </v-card-text>
      </template>
    </v-card>
  </div>
</template>

<script>

export default {

  data: function () {
    return {}
  },

  async asyncData ({ $axios, params, store }) {
    const response = await $axios.get('FROST-Server/v1.1/Datastreams?$filter=Datastreams/Observations/result eq \'' + params.tagname + '\'', {
      transformRequest: [(data, headers) => {
        delete headers.common.Authorization
        return data
      }]
    })
    return {
      questions: response.data.value
    }
  },

  mounted () {
    $nuxt.$emit('unselectAll')
    this.$store.commit('ogr/addTag', this.$route.params.tagname)
    $nuxt.$emit('updateLayer', 'OGR')
  }
}

</script>

<style scoped>

</style>
