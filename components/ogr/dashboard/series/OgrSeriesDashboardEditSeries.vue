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
  <v-container>
    <ogr-dialog-confirm
      :active="dialog.active"
      color="warning"
      :submit="dialog.submit"
      :title="dialog.title"
      :text="dialog.text"
      @click-submit="deleteSeriesElement"
      @click-abort="abortConfirmDialog"
    ></ogr-dialog-confirm>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="10">
        <template v-for="s in series">
          <ogr-forum-series-parent-preview
            class="mb-7"
            v-if="s"
            :series="s"
            :key="s.id"
            :expand="true"
            :dashboard="true"
          >
            <v-card-actions class="pa-0 mb-0 mt-1">
              <v-spacer />
              <v-btn
                v-ripple="false"
                plain
                color="info"
                @click="toggleSeriesElements(s.id)"
              >
                {{ expand === s.id ? 'Verberge Serienelemente' : 'Zeige Serienelemente' }}
                <v-icon>{{ expand === s.id ? mdiChevronUp : mdiChevronDown }}</v-icon>
              </v-btn>
              <v-spacer />
            </v-card-actions>
            <v-expand-transition>
              <div v-show="expand === s.id" class="pb-1 pr-1">
                <template v-for="q in seriesChildren">
                  <ogr-forum-series-child-preview
                    v-if="q"
                    :question="q"
                    :key="q.id"
                    :series-data="s"
                    :dashboard="true"
                    @click-delete-series-child="openConfirmDialog($event, s.id)"
                  >
                  </ogr-forum-series-child-preview>
                </template>
              </div>
            </v-expand-transition>
          </ogr-forum-series-parent-preview>
        </template>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import questionSeriesByUserId from '~/apollo/queries/questionSeriesByUserId.gql'
import OgrForumSeriesParentPreview from '../../forum/OgrForumSeriesParentPreview'
import questionSeriesChildren from '@/apollo/queries/questionSeriesChildren'
import OgrForumSeriesChildPreview from '@/components/ogr/forum/OgrForumSeriesChildPreview'
import OgrDialogConfirm from '@/components/ogr/dialog/OgrDialogConfirm'
import axios from 'axios'

export default {
  name: 'ogrSeriesDashboardEditSeries',
  components: { OgrDialogConfirm, OgrForumSeriesChildPreview, OgrForumSeriesParentPreview },

  data () {
    return {
      mdiChevronUp,
      mdiChevronDown,
      series: [],
      expand: null,
      seriesChildren: [],
      dialog: {
        active: false,
        title: this.$t('series_action_delete_child_title'),
        text: this.$t('series_action_delete_child_text'),
        submit: this.$t('series_action_delete_child_submit'),
        id: null
      },
      ogrApiUrl: this.$config.ogrApiUrl
    }
  },

  mounted () {
    this.getSeries()
  },

  methods: {
    getSeries () {
      this.$apollo.query({
        query: questionSeriesByUserId,
        variables: {
          id: this.$auth.user.id
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.series = response.data.questionSeriesByUserId
      })
    },
    toggleSeriesElements (id) {
      if (this.expand === id) {
        this.expand = null
      } else {
        this.expand = id
        this.getSeriesChildren(id)
      }
    },
    getSeriesChildren (id) {
      this.$apollo.query({
        query: questionSeriesChildren,
        variables: {
          id
        },
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.seriesChildren = response.data.questionSeriesChildren
      })
    },
    openConfirmDialog (questionId, seriesId) {
      this.dialog.questionId = questionId
      this.dialog.seriesId = seriesId
      this.dialog.text = ''
      this.dialog.active = true
    },
    abortConfirmDialog () {
      this.dialog.questionId = null
      this.dialog.seriesId = null
      this.dialog.active = false
    },
    deleteSeriesElement () {
      console.log(this.dialog.id)
      const url = '/ogr/question_series/hide_child'
      const request = { seriesId: this.dialog.seriesId, questionId: this.dialog.questionId }
      const config = this.createConfig('application/json')
      axios.post(this.ogrApiUrl + url, request, config)
        .then((response) => {
          if (response.status === 200) {
            console.log(response)
            this.dialog.questionId = null
            this.dialog.seriesId = null
            this.dialog.active = false
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
