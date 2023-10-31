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
    v-ripple="false"
    class="mb-2 ml-10 pt-0 pb-0"
    elevation="0"
  >
    <v-card-actions class="mb-0 pb-0">
      <ogr-editor
        v-model="newAnswer"
        v-on:update-characters="characters = $event"
        :limit="4000"
        :placeholder="'Gib hier deine Antwort ein'"
      />
    </v-card-actions>
    <v-card-actions class="mb-0 pb-0">
      <ogr-geo-service-list
        :services="wms"
        @update-layer-visibility="updateLayerVisibility"
        @update-layer-opacity="updateLayerOpacity"
        @click-remove-service="removeService"
      />
    </v-card-actions>
    <v-card-actions v-if="this.$auth.loggedIn && ( this.$auth.user.roles.includes('ROLE_EXPERT') )" class="mt-0 pt-0 mb-0 pb-0">
      <v-btn
        v-ripple="false"
        small
        plain
        color="secondary"
        @click="expand = !expand"
      >
        {{ expand ? 'ausblenden' : 'Mit Kartendienst antworten' }}
        <v-icon>{{ expand ? mdiChevronUp : mdiChevronDown }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <v-card-actions v-if="expand" class="mt-0 pt-0" >
        <ogr-geo-service-input
          @click-cancel="expand = false"
          @update-web-map-services="updateWebMapServices($event)"
        />
      </v-card-actions>
    </v-expand-transition>
    <v-card-actions class="pt-0 mb-0 pb-2">
      <v-spacer />
      <v-btn
        class="ml-1"
        :disabled="loading"
        @click="$emit('click-answer-cancel')"
      >
        {{ $t('general_abort') }}
      </v-btn>
      <v-btn
        color="primary"
        :disabled="disabled"
        :loading="loading"
        @click="answerQuestion(newAnswer)"
      >
        {{ $t('general_send') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import answerQuestion from '~/apollo/mutations/answerQuestion.gql'
import OgrEditor from '@/components/ogr/editor/OgrEditor'
import OgrGeoServiceInput from '@/components/ogr/geoservice/OgrGeoServiceInput'
import OgrGeoServiceList from '~/components/ogr/geoservice/OgrGeoServiceList'

export default {

  name: 'OgrForumAnswerInput',
  components: { OgrGeoServiceList, OgrGeoServiceInput, OgrEditor },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    id: {
      required: true,
      default: null
    }
  },

  data () {
    return {
      mdiChevronUp,
      mdiChevronDown,
      newAnswer: '',
      commentField: false,
      disabled: true,
      loading: false,
      characters: 0,
      expand: false,
      wms: []
    }
  },

  watch: {
    characters: function () {
      this.disabled = this.characters > 4000 || this.characters === 0
    }
  },

  methods: {
    updateLayerVisibility (id, visible) {
      console.log(id)
      console.log(visible)
      this.wms.forEach((service) => {
        if (service.id === id) {
          service.visible = visible
        }
      })
      console.log(this.wms)
    },
    updateLayerOpacity (id, opacity) {
      console.log(id)
      console.log(opacity)
      this.wms.forEach((service) => {
        if (service.id === id) {
          service.opacity = opacity
        }
      })
      console.log(this.wms)
    },
    removeService (id) {
      this.$nuxt.$emit('setLayerVisibility', id, false)
      const tmp = []
      this.wms.forEach((service) => {
        if (service.id !== id) {
          tmp.push(service)
        }
      })
      this.wms = tmp
      console.log(this.wms)
    },
    updateWebMapServices (service) {
      console.log(service)
      this.wms.push(service)
      console.log(this.wms)
      this.expand = false
    },
    answerQuestion (newAnswer) {
      this.loading = true
      this.disabled = true
      const wms = this.createWmsPayload()
      if (this.$auth.loggedIn) {
        this.$apollo.mutate({
          mutation: answerQuestion,
          variables: {
            id: this.id,
            content: newAnswer,
            wms
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.newComment = ''
          this.loading = false
          this.disabled = false
          this.$emit('update-answers', response.data.answerQuestion.answers)
        })
      }
    },
    createWmsPayload () {
      const payload = []
      this.wms.forEach((service) => {
        payload.push({
          title: service.title,
          url: service.url,
          layers: service.layers,
          visible: service.visible,
          opacity: service.opacity,
          description: service.description,
          legend: service.legend
        })
      })
      return payload
    }
  }
}
</script>
