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
  <div v-if="questionData">
    <ogr-forum-question
      :id="questionData.id"
      :question="datastream.name"
      :description="datastream.description"
      :category="classification(datastream.unitOfMeasurement.symbol)"
      :images="datastream.properties.images"
      :votes="questionData.votes"
      :result-time="datastream.resultTime"
      :user="questionData.user"
      :comment-data="questionData.comments"
      :semantic-tags="semanticTags"
      :functional-tags="functionalTags"
      @forum-input-dialog-opened="$emit('forum-input-dialog-opened')"
      @forum-input-dialog-closed="$emit('forum-input-dialog-closed')"
      @update-semantic-tags="$emit('update-semantic-tags')"
      @update-functional-tags="$emit('update-functional-tags')"
    />
    <v-card
      v-ripple="false"
      class="mb-2 mt-0 pa-2"
      elevation="0"
    >
      <v-banner
        v-if="expertAnswers.length > 0"
        dark
        single-line
        class="mt-5 mb-0"
        elevation="3"
        :icon="mdiSchool"
        color="secondary"
      >
        {{ $t('forum_banner_answers_expert') }}
      </v-banner>
      <ogr-forum-answer-with-comments
        v-for="answer in expertAnswers"
        :key="answer.id"
        :answer-data="answer"
        @forum-input-dialog-opened="$emit('forum-input-dialog-opened')"
        @forum-input-dialog-closed="$emit('forum-input-dialog-closed')"
      />
      <v-banner
        v-if="communityAnswers.length > 0"
        dark
        single-line
        class="mt-5 mb-0"
        elevation="3"
        :icon="mdiAccountGroup"
        color="secondary"
      >
        {{ $t('forum_banner_answers_community') }}
      </v-banner>
      <ogr-forum-answer-with-comments
        v-for="answer in communityAnswers"
        :key="answer.id"
        :answer-data="answer"
        @forum-input-dialog-opened="$emit('forum-input-dialog-opened')"
        @forum-input-dialog-closed="$emit('forum-input-dialog-closed')"
      />
      <v-row no-gutters v-if="!showAnswerInput">
        <v-spacer />
        <v-btn
          small
          plain
          color="neutral"
          :disabled="!(this.$auth.loggedIn && this.$nuxt.isOnline)"
          @click="showAnswerInput = true"
        >
          {{ $t('forum_add_answer') }}
          <v-icon class="ml-1">
            {{ mdiMessagePlus }}
          </v-icon>
        </v-btn>
        <v-spacer />
      </v-row>
      <ogr-forum-answer-input
        v-else
        :id="questionData.id"
        @click-answer-cancel="showAnswerInput = false"
        @update-answers="updateAnswers"
      />
    </v-card>
  </div>
  <div v-else>
    <v-skeleton-loader class="mb-3" type="card-avatar, article, card-heading@3, divider, card-heading, list-item-avatar, article, card-heading@3" elevation="2"></v-skeleton-loader>
  </div>
</template>

<script>
import { mdiAccountGroup, mdiSchool, mdiMessagePlus } from '@mdi/js'
import question from '~/apollo/queries/question'
import answerQuestion from '~/apollo/mutations/answerQuestion.gql'
import OgrForumQuestion from './OgrForumQuestion'
import { getCategoryFromCode } from '~/util/ogr-utils'
import OgrForumAnswerWithComments from './OgrForumAnswerWithComments'
import OgrForumAnswerInput from './OgrForumAnswerInput'

export default {
  name: 'OgrForumPanel',
  components: { OgrForumAnswerInput, OgrForumAnswerWithComments, OgrForumQuestion },
  props: {
    datastream: {
      type: Object,
      required: true
    },
    semanticTags: {
      type: Array,
      required: true
    },
    functionalTags: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      mdiAccountGroup,
      mdiSchool,
      mdiMessagePlus,
      questionData: undefined,
      answerData: undefined,
      expertAnswers: [],
      communityAnswers: [],
      loaded: false,
      input: false,
      post: '',
      rules: {
        length: len => v => (v || '').length <= len || this.$t('input_text_length', [len])
      },
      loading: false,
      showAnswerInput: false
    }
  },

  created () {
    if (this.datastream) {
      this.getQuestionData()
    }
  },

  methods: {
    classification (category) {
      return getCategoryFromCode(category, this.$i18n.locale)
    },
    openForumInputDialog () {
      this.input = true
      this.$emit('forum-input-dialog-opened')
    },
    closeForumInputDialog () {
      this.input = false
      this.$emit('forum-input-dialog-closed')
    },
    getQuestionData () {
      this.$apollo.query({
        query: question,
        variables: {
          id: this.datastream['@iot.id']
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        if (response.data.question) {
          this.questionData = response.data.question
          this.splitAnswers(this.questionData.answers)
          this.sortByVote()
          this.loaded = true
        }
      })
    },
    splitAnswers (answers) {
      const expertAnswers = []
      const communityAnswers = []

      for (const answer of answers) {
        let isExpert = false
        for (const role of answer.user.roles) {
          if (role.name === 'ROLE_EXPERT') {
            isExpert = true
          }
        }

        if (isExpert) {
          expertAnswers.push(answer)
        } else {
          communityAnswers.push(answer)
        }
      }

      this.expertAnswers = expertAnswers
      this.communityAnswers = communityAnswers
    },
    sortByDate () {
      this.expertAnswers = this.expertAnswers.sort((a, b) => new Date(b.created) - new Date(a.created))
    },
    sortByVote () {
      this.expertAnswers = this.expertAnswers.sort((a, b) => b.votes.upCount - a.votes.upCount)
    },
    sendPost () {
      if (this.$auth.loggedIn && this.$nuxt.isOnline) {
        if (this.post.length <= 4000 || this.post.length > 0) {
          this.loading = true
          this.$nuxt.$emit('loading-start')
          this.$apollo.mutate({
            mutation: answerQuestion,
            variables: {
              id: this.questionId,
              content: this.post
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            this.splitAnswers(response.data.answerQuestion.answers)
            this.sortByVote()
            this.post = ''
            this.$nuxt.$emit('loading-status', { status: true, message: this.$t('loading_success_messsage_standard') })
            this.loading = false
            this.closeForumInputDialog()
          }).catch(() => {
            this.$nuxt.$emit('loading-status', { status: false, message: this.$t('loading_error_messsage_standard') })
            this.loading = false
            this.closeForumInputDialog()
          })
        }
      }
    },
    updateAnswers (val) {
      this.splitAnswers(val)
      this.showAnswerInput = false
    }
  }
}
</script>
