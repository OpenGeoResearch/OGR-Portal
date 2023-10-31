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
        <ogr-editor-dashboard-filter-panel
            @click-submit-filter="submitFilter"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <ogr-editor-dashboard-table-inquiry
          v-if="id === 'ogrEditorDashboardAnswerPendingFirst' || id === 'ogrEditorDashboardAnswerPendingSecond'"
          :items="questions"
          :actions="actions"
          @expert-dialog-open="expert.dialog = true"
          @click-action-interesting="addTags($event, 'interesting')"
          @click-action-not-interesting="removeTags($event, 'not-interesting')"
          @click-action-review="addTags($event, 'review')"
          @click-action-close="addTags($event, 'close')"
          @click-action-re-open="removeTags($event, 're-open')"
          @click-action-ask-community="askCommunity($event)"
        />
        <ogr-editor-dashboard-table-default
          v-else
          :items="questions"
          :actions="actions"
          @expert-dialog-open="expert.dialog = true"
          @click-action-interesting="addTags($event, 'interesting')"
          @click-action-not-interesting="removeTags($event, 'not-interesting')"
          @click-action-review="addTags($event, 'review')"
          @click-action-close="addTags($event, 'close')"
          @click-action-re-open="removeTags($event, 're-open')"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <ogr-editor-dashboard-dialog-inquire
          :show="expert.dialog"
          :experts="experts"
          :success="expert.success"
          :loading="expert.loading"
          :loader="expert.loader"
          @expert-dialog-close="expert.dialog = false"
          @expert-dialog-send="sendToExpert"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>

import { getCategoryFromCode } from '@/util/ogr-utils.js'
import gql from 'graphql-tag'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import questionsByEditorFilter from '@/apollo/queries/questionsByEditorFilter'
import setFunctionalTagsAndGetQuestionsByEditorFilter
  from '@/apollo/mutations/setFunctionalTagsAndGetQuestionsByEditorFilter'
import removeFunctionalTagsAndGetQuestionsByEditorFilter
  from '@/apollo/mutations/removeFunctionalTagsAndGetQuestionsByEditorFilter'
import OgrEditorDashboardFilterPanel from '@/components/ogr/dashboard/editor/filter/OgrEditorDashboardFilterPanel'
import OgrEditorDashboardTableDefault from '@/components/ogr/dashboard/editor/table/OgrEditorDashboardTableDefault'
import OgrEditorDashboardDialogInquire from '@/components/ogr/dashboard/editor/dialog/OgrEditorDashboardDialogInquire'
import OgrEditorDashboardTableInquiry from './table/OgrEditorDashboardTableInquiry'

export default {
  name: 'OgrEditorDashboardTab',
  components: {
    OgrEditorDashboardTableInquiry,
    OgrEditorDashboardDialogInquire,
    OgrEditorDashboardTableDefault,
    OgrEditorDashboardFilterPanel
  },
  data () {
    return {
      ogrMapUrl: this.$config.ogrMapUrl,
      ogrApiUrl: this.$config.ogrApiUrl,
      item: undefined,
      expanded: [],
      items: [],
      expert: {
        dialog: false,
        success: false,
        loading: false,
        loader: false
      },
      questions: undefined,
      experts: undefined
    }
  },

  props: {
    id: {
      type: String,
      required: true,
      default: ''
    },
    includedTags: {
      type: Array,
      required: false,
      default: () => { return [] }
    },
    excludedTags: {
      type: Array,
      required: false,
      default: () => { return [] }
    },
    actions: {
      type: Array,
      required: false,
      default: () => { return [] }
    }
  },

  computed: {
    selectedDates: {
      get: function () {
        return this.$store.state['editor-dashboard'].filter.dates
      }
    },
    selectedCategory: {
      get: function () {
        return this.$store.state['editor-dashboard'].filter.category
      }
    },
    selectedTags: {
      get: function () {
        return this.$store.state['editor-dashboard'].filter.tags
      }
    }
  },

  created () {
    this.submitFilter()
    this.getExperts()
  },

  methods: {
    getExperts () {
      this.$apollo.query({
        query: gql`query User {
                  getExperts {
                    id,
                    username
                  }
                }`,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        if (response.data.getExperts) {
          this.experts = response.data.getExperts
        }
      })
    },
    askCommunity (id) {
      console.log('Asking the community on question: ' + id)
    },
    sendToExpert () {
      this.expert.loader = true
      this.expert.loading = true
      const questionId = this.$store.state['editor-dashboard'].send.question_id
      const expertId = this.$store.state['editor-dashboard'].send.expert_id
      const round = this.$store.state['editor-dashboard'].send.round
      this.addTags(questionId, 'inquire-' + round)
      this.$apollo.mutate({
        mutation: gql`mutation ( $question_id: ID!, $expert_id: ID!) {
                    sendQuestionToExpert(question_id: $question_id, expert_id: $expert_id)
                  }`,
        variables: {
          question_id: questionId,
          expert_id: expertId
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        if (response.data.sendQuestionToExpert) {
          setTimeout(() => (this.expert.loading = false), 500)
          setTimeout(() => (this.expert.success = true), 500)
          setTimeout(() => (this.expert.dialog = false), 2000)
          setTimeout(() => (this.expert.loader = false), 2000)
          setTimeout(() => (this.expert.success = false), 2100)
        }
      })
    },
    getDates () {
      let dates = []
      if (this.$store.state['editor-dashboard'].filter.dates === 2) {
        dates = this.$store.state['editor-dashboard'].filter.dates
      }
      return dates
    },
    getCategory () {
      let categoryCode
      if (this.$store.state['editor-dashboard'].filter.category === undefined) {
        categoryCode = ''
      } else {
        categoryCode = this.$store.state['editor-dashboard'].filter.category
      }
      return categoryCode
    },
    getSemanticTags () {
      return this.$store.state['editor-dashboard'].filter.tags
    },
    getNewTags (action) {
      let newTags = []
      if (action === 'inquire-first') {
        newTags = ['handled', 'exp-inquired-first']
      } else if (action === 'inquire-second') {
        newTags = ['handled', 'exp-inquired-second']
      } else if (action === 'review') {
        newTags = ['handled', 'needs-review']
      } else if (action === 'close') {
        newTags = ['handled', 'closed']
      } else if (action === 'interesting') {
        newTags = ['handled', 'potential']
      }
      return newTags
    },
    getRemoveTags (action) {
      let removeTags = []
      if (action === 'not-interesting') {
        removeTags = ['potential']
      } else if (action === 're-open') {
        removeTags = ['closed']
      }
      return removeTags
    },
    addTags (id, action) {
      this.$apollo.mutate({
        mutation: setFunctionalTagsAndGetQuestionsByEditorFilter,
        variables: {
          includedTags: this.includedTags,
          excludedTags: this.excludedTags,
          categoryCode: this.getCategory(),
          dates: this.getDates(),
          semanticTags: this.getSemanticTags(),
          id: id,
          newTags: this.getNewTags(action)
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.questions = response.data.setFunctionalTagsAndGetQuestionsByEditorFilter
      })
    },
    removeTags (id, action) {
      this.$apollo.mutate({
        mutation: removeFunctionalTagsAndGetQuestionsByEditorFilter,
        variables: {
          includedTags: this.includedTags,
          excludedTags: this.excludedTags,
          categoryCode: this.getCategory(),
          dates: this.getDates(),
          semanticTags: this.selectedTags,
          id: id,
          removeTags: this.getRemoveTags(action)
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.questions = response.data.removeFunctionalTagsAndGetQuestionsByEditorFilter
      })
    },
    submitFilter () {
      this.$apollo.query({
        query: questionsByEditorFilter,
        variables: {
          includedTags: this.includedTags,
          excludedTags: this.excludedTags,
          categoryCode: this.getCategory(),
          dates: this.getDates(),
          semanticTags: this.selectedTags
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.questions = response.data.questionsByEditorFilter
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
