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
      :info="dialog.info"
      @click-submit="deleteSeriesElement"
      @click-abort="abortConfirmDialog"
    ></ogr-dialog-confirm>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="10">
        <v-list-item class="pa-0 ma-0">
          <v-switch
            style="justify-content: flex-start"
            class="pa-0 ma-0 ml-5"
            v-model="open"
            color="info"
            :label="$t('series_open_only')"
            hide-details
          ></v-switch>
          <v-spacer />
          <v-btn-toggle
            v-model="sortStrategy"
            class="d-flex justify-end mt-0 mr-1 mb-0 pb-0"
            color="primary"
            dense
            mandatory
          >
            <v-btn value="newest">
              {{$t('newest_questions')}}
            </v-btn>

            <v-btn value="oldest">
              {{$t('oldest_questions')}}
            </v-btn>

            <v-btn value="highestVoted">
              {{$t('top_questions')}}
            </v-btn>
          </v-btn-toggle>
        </v-list-item>
        <template v-for="s in sortedSeries">
          <ogr-forum-series-parent-preview
            class="mb-7"
            v-if="s"
            :series="s"
            :key="s.id"
            :expand="true"
            :dashboard="true"
            @click-series-show-children="showQuestionSeriesChildren"
            @click-series-close="closeQuestionSeries"
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
                <v-card width="400" elevation="0">
                  <v-card-actions>
                    <v-select
                      v-model="selectedUser"
                      label="Beobachtungen nach Benutzer filtern"
                      clearable
                      dense
                      outlined
                      :items="seriesContributors"
                    />
                  </v-card-actions>
                </v-card>
                <template v-for="q in filteredSeriesChildren">
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
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import questionSeriesByUserId from '~/apollo/queries/questionSeriesByUserId.gql'
import OgrForumSeriesParentPreview from '../../forum/OgrForumSeriesParentPreview'
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
        info: this.$t('series_action_delete_child_text'),
        submit: this.$t('series_action_delete_child_submit'),
        id: null
      },
      ogrApiUrl: this.$config.ogrApiUrl,
      open: false,
      sortStrategy: 'newest',
      selectedUser: undefined
    }
  },

  computed: {
    oldestSeriesFirst () {
      if (this.open) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.openSeries.sort((a, b) => new Date(a.parentQuestion.datastream.resultTime) - new Date(b.parentQuestion.datastream.resultTime))
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.series.sort((a, b) => new Date(a.parentQuestion.datastream.resultTime) - new Date(b.parentQuestion.datastream.resultTime))
    },
    newestSeriesFirst () {
      if (this.open) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.openSeries.sort((a, b) => new Date(a.parentQuestion.datastream.resultTime) - new Date(b.parentQuestion.datastream.resultTime)).reverse()
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.series.sort((a, b) => new Date(a.parentQuestion.datastream.resultTime) - new Date(b.parentQuestion.datastream.resultTime)).reverse()
    },
    highestVotedSeriesFirst () {
      if (this.open) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.openSeries.sort((a, b) => (b.parentQuestion.votes.upCount - b.parentQuestion.votes.downCount) - (a.parentQuestion.votes.upCount - a.parentQuestion.votes.downCount))
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.series.sort((a, b) => (b.parentQuestion.votes.upCount - b.parentQuestion.votes.downCount) - (a.parentQuestion.votes.upCount - a.parentQuestion.votes.downCount))
    },
    openSeries () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.series.filter((a) => Date.now() < Date.parse(a.end))
    },
    sortedSeries () {
      if (this.sortStrategy === 'highestVoted') {
        return this.highestVotedSeriesFirst
      } else if (this.sortStrategy === 'newest') {
        return this.newestSeriesFirst
      } else {
        return this.oldestSeriesFirst
      }
    },
    filteredSeriesChildren () {
      if (this.selectedUser) {
        return this.seriesChildren.filter((element) => {
          if (element.user) {
            if (element.user.username === this.selectedUser) {
              return element
            }
          }
          return false
        })
      } else {
        return this.seriesChildren
      }
    },
    seriesContributors () {
      const contributors = []
      for (const element of this.seriesChildren) {
        if (element.user) {
          const username = element.user.username
          if (!contributors.includes(username)) {
            contributors.push(username)
          }
        }
      }
      return contributors
    }
  },

  mounted () {
    this.getSeries()
  },

  methods: {
    checkSeriesStatus () {
      return Date.now() < Date.parse(this.seriesData.end)
    },
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
      const config = this.createConfig('application/json')
      axios.get(this.ogrApiUrl + '/ogr/questionSeriesChildren/' + id, config)
        .then((response) => {
          if (response.status === 200) {
            this.seriesChildren = response.data
            console.log(this.seriesChildren)
          } else {
            this.seriesChildren = []
          }
        })
        .catch(() => {
          this.seriesChildren = []
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
      const url = '/ogr/question_series/hide_child'
      const request = { seriesId: this.dialog.seriesId, questionId: this.dialog.questionId }
      const config = this.createConfig('application/json')
      axios.post(this.ogrApiUrl + url, request, config)
        .then((response) => {
          if (response.status === 200) {
            this.getSeriesChildren(this.dialog.seriesId)
            this.dialog.questionId = null
            this.dialog.seriesId = null
            this.dialog.active = false
          }
        })
        .catch(() => {
          this.dialog.questionId = null
          this.dialog.seriesId = null
          this.dialog.active = false
        })
    },
    createConfig (type) {
      if (this.$auth.getToken('local')) {
        return { headers: { 'Content-Type': type, Authorization: this.$auth.getToken('local') } }
      } else {
        return { headers: { 'Content-Type': type } }
      }
    },
    showQuestionSeriesChildren (id) {
      const url = this.ogrApiUrl + '/ogr/question_series/show_children/'
      const request = { seriesId: id }
      const config = this.createConfig('application/json')
      axios.post(url, request, config)
        .then((response) => {
          if (response.status === 200) {
            this.getSeries()
          }
        })
        .catch(() => {})
    },
    closeQuestionSeries (id) {
      const url = this.ogrApiUrl + '/ogr/question_series/close_now/'
      const request = { seriesId: id }
      const config = this.createConfig('application/json')
      axios.post(url, request, config)
        .then((response) => {
          if (response.status === 200) {
            this.getSeries()
          }
        })
        .catch(() => {})
    }
  }
}
</script>
