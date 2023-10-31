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
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        :color="isInteresting ? 'confirm' : 'neutral'"
        v-bind="attrs"
        v-on="on"
        @click="changeFunctionalTag('potential')"
      >
        mdi-star-check
      </v-icon>
    </template>
    <span>{{ isInteresting ?  'Markierung "Interessant" entfernen (Editor)' : 'Als interessant markieren (Editor)' }}</span>
  </v-tooltip>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'OgrQuestionActionInteresting',

  data () {
    return {
      ogrApiUrl: this.$config.ogrApiUrl,
      functionalTags: [],
      isInteresting: false
    }
  },

  props: {
    id: {
      required: true,
      default: null
    }
  },

  computed: {
    ...mapState('ogr', ['selectedQuestion'])
  },

  mounted () {
    this.getFunctionalTags()
  },

  methods: {
    changeFunctionalTag (tag) {
      const config = this.createConfig('application/json')
      const request = { datastreamId: this.id, functionalTags: tag }
      let url
      if (this.isInteresting) {
        url = '/ogr/removeFunctionalTag'
      } else {
        url = '/ogr/addFunctionalTag'
      }
      axios.post(this.ogrApiUrl + url, request, config)
        .then((response) => {
          if (response.status === 200) {
            this.setHandled()
            this.getFunctionalTags()
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
    getFunctionalTags () {
      axios.get(this.selectedQuestion['Observations@iot.navigationLink'] + "?$filter=parameters/type eq 'functional'&$select=result")
        .then((response) => {
          this.functionalTags = []
          let i
          for (i = 0; i < response.data.value.length; i++) {
            this.functionalTags.push(response.data.value[i].result)
            this.isInteresting = this.functionalTags.includes('potential')
          }
        })
        .catch(function () {
        })
    },
    setHandled () {
      const config = this.createConfig('application/json')
      const request = { datastreamId: this.id, functionalTag: 'handled' }
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
