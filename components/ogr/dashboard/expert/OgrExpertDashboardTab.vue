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
  <div>
    <v-row no-gutters>
      <v-col cols="12">
        <ogr-expert-dashboard-dialog-reject
          :show="dialog.reject"
          @reject-dialog-close="dialog.reject = false"
          @reject-dialog-send="sendRejection"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <ogr-editor-dashboard-table-default
            :items="questions"
            :actions="actions"
            @reject-dialog-open="dialog.reject = true"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>

import { getCategoryFromCode } from '@/util/ogr-utils.js'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import OgrEditorDashboardTableDefault from './table/OgrExpertDashboardTableDefault'
import inquiredQuestions from '@/apollo/queries/inquiredQuestions.gql'
import answeredQuestions from '@/apollo/queries/answeredQuestions.gql'
import rejectedQuestions from '@/apollo/queries/rejectedQuestions.gql'
import rejectExpertInquiry from '@/apollo/mutations/rejectExpertInquiry.gql'
import OgrExpertDashboardDialogReject from './dialog/OgrExpertDashboardDialogReject'

export default {
  name: 'OgrExpertDashboardTab',
  components: {
    OgrExpertDashboardDialogReject,
    OgrEditorDashboardTableDefault
  },
  data () {
    return {
      ogrMapUrl: this.$config.ogrMapUrl,
      ogrApiUrl: this.$config.ogrApiUrl,
      item: undefined,
      expanded: [],
      items: [],
      dialog: {
        reject: false
      },
      questions: []
    }
  },

  props: {
    id: {
      type: String,
      required: true,
      default: ''
    },
    actions: {
      type: Array,
      required: false,
      default: () => { return [] }
    }
  },

  created () {
    if (this.id === 'ogrExpertDashboardInquired') {
      this.getInquiredQuestions()
    } else if (this.id === 'ogrExpertDashboardAnswered') {
      this.getAnsweredQuestions()
    } else if (this.id === 'ogrExpertDashboardRejected') {
      this.getRejectedQuestions()
    }
  },

  methods: {
    getInquiredQuestions () {
      this.$apollo.query({
        query: inquiredQuestions,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.questions = response.data.inquiredQuestions
      })
    },
    getAnsweredQuestions () {
      this.$apollo.query({
        query: answeredQuestions,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.questions = response.data.answeredQuestions
      })
    },
    getRejectedQuestions () {
      this.$apollo.query({
        query: rejectedQuestions,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.questions = response.data.rejectedQuestions
      })
    },
    sendRejection () {
      const questionId = this.$store.state['editor-dashboard'].reject.question_id
      const comment = this.$store.state['editor-dashboard'].reject.comment
      this.$apollo.mutate({
        mutation: rejectExpertInquiry,
        variables: {
          question_id: questionId,
          comment: comment
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        if (response.data.rejectExpertInquiry) {
          this.questions = response.data.rejectExpertInquiry
          this.dialog.reject = false
          this.$store.commit('editor-dashboard/resetReject')
        }
      })
    },
    parseCategory (code, lang) {
      return getCategoryFromCode(code, lang)
    }
  }
}
</script>

<style scoped>

</style>
