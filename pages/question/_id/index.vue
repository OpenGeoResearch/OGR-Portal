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
  <ogr-forum-panel
    :datastream="selectedQuestion"
    :semantic-tags="semanticTags"
    :functional-tags="functionalTags"
    @update-semantic-tags="reloadSemanticTags"
    @update-functional-tags="reloadFunctionalTags"
  />
</template>

<script>
/* eslint-disable no-undef */

import axios from 'axios'
import { mapState } from 'vuex'
import OgrForumPanel from '../../../components/ogr/forum/OgrForumPanel'

export default {
  components: { OgrForumPanel },
  data: function () {
    return {
      semanticTags: [],
      functionalTags: []
    }
  },

  async asyncData ({ $axios, $config, params, store }) {
    const { data } = await axios.get($config.ogrApiUrl + '/FROST-Server/v1.1/Datastreams(' + params.id + ')')
    store.commit('ogr/setSelectedQuestion', data)
  },

  computed: {
    ...mapState('ogr', ['selectedQuestion'])
  },

  beforeRouteLeave (to, from, next) {
    next()
  },

  mounted () {
    axios.get(this.selectedQuestion['Observations@iot.navigationLink'] + "?$filter=parameters/type eq 'semantic'&$select=result")
      .then(response => (this.semanticTags = response.data.value))
      .catch(function () {})
    axios.get(this.selectedQuestion['Observations@iot.navigationLink'] + "?$filter=parameters/type eq 'functional'&$select=result")
      .then(response => (this.functionalTags = response.data.value))
      .catch(function () {})

    this.$nuxt.$emit('reloadMapCanvas')
    this.$nuxt.$emit('centerMap', this.selectedQuestion.observedArea.coordinates)

    setTimeout(() => this.$nuxt.$emit('zoomToCoordinates', this.selectedQuestion.observedArea.coordinates), 500)
    // setTimeout(() => this.$nuxt.$emit('selectFeatures', 'OGR', 'id', this.selectedQuestion['@iot.id']), 500)
    this.$nuxt.$once('mapinitcomplete', () => {
      setTimeout(() => {
        this.$nuxt.$emit('selectFeatures', 'OGR', 'id', this.selectedQuestion['@iot.id'])
      }
      , 500)
    })
  },

  methods: {
    reloadSemanticTags () {
      axios.get(this.selectedQuestion['Observations@iot.navigationLink'] + "?$filter=parameters/type eq 'semantic'&$select=result")
        .then(response => (this.semanticTags = response.data.value))
        .catch(function () {})
    },
    reloadFunctionalTags () {
      axios.get(this.selectedQuestion['Observations@iot.navigationLink'] + "?$filter=parameters/type eq 'functional'&$select=result")
        .then(response => (this.functionalTags = response.data.value))
        .catch(function () {})
    }
  }
}
</script>

<style scoped>

</style>
