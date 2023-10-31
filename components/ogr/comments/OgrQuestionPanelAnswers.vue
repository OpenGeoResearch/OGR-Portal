<template>
  <v-container class="px-0">
    <v-row :class="rowPadding">
      <v-card-title
        v-if="this.answers.length === 1"
        class="py-1"
      >
        {{this.answers.length}} {{ $t('answer') | capitalize }}
        <v-card-subtitle class="pa-0 primary--text"> &nbsp;({{expertAnswerNumber}} {{$t('ogr_by_experts')}})</v-card-subtitle>
      </v-card-title>
      <v-card-title
        v-if="this.answers.length > 1"
        class="py-1"
      >
        {{this.answers.length}} {{ $t('answers') | capitalize }}
        <v-card-subtitle class="pa-0 primary--text"> &nbsp;({{expertAnswerNumber}} {{$t('ogr_by_experts')}})</v-card-subtitle>
      </v-card-title>
      <v-spacer></v-spacer>
      <v-btn-toggle
        v-if="this.answers.length >= 2"
        v-model="sortStrategy"
        color="primary"
        dense
      >
        <v-btn
          value="newest"
          small
        >
          {{$t('newest_answers')}}
        </v-btn>

        <v-btn
          value="oldest"
          small
        >
          {{$t('oldest_answers')}}
        </v-btn>

        <v-btn
          value="highestVoted"
          small
        >
          {{$t('top_answers')}}
        </v-btn>
      </v-btn-toggle>
    </v-row>
    <v-divider></v-divider>
    <ogr-question-panel-answer
      v-for="answer in this.answers"
      :answer="answer"
      :key="answer.id"
      @deleteAnswer="deleteAnswer"
    >
    </ogr-question-panel-answer>
  </v-container>
</template>

<script>
/* eslint-disable vue/no-mutating-props,vue/no-side-effects-in-computed-properties */

import gql from 'graphql-tag'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'OgrQuestionPanelAnswers',
  components: { },
  mixins: [Vue2Filters.mixin],
  props: {
    question: Object
  },
  data: function () {
    return {
      answerCommentary: false,
      sortStrategy: 'highestVoted',
      dialogText: 'Do you really want to clear all the component data?<br/>This will clear the components except the pressure and composition basis!'
    }
  },
  computed: {

    oldestAnswersFirst () {
      const expertAnswers = []
      let communityAnswers = []
      let isScientist = false
      for (const a of this.question.answers) {
        for (const role of a.user.roles) {
          if (role.name === 'ROLE_EXPERT') {
            isScientist = true
          }
        }
        if (isScientist === true) {
          expertAnswers.push(a)
          isScientist = false
        } else {
          communityAnswers.push(a)
        }
      }
      const allAnswers = (expertAnswers.sort((a, b) => new Date(a.created) - new Date(b.created)))
      communityAnswers = communityAnswers.sort((a, b) => new Date(a.created) - new Date(b.created))
      for (const answer of communityAnswers) {
        allAnswers.push(answer)
      }
      return allAnswers
    },
    newestAnswersFirst () {
      const expertAnswers = []
      let communityAnswers = []
      let isScientist = false
      for (const a of this.question.answers) {
        for (const role of a.user.roles) {
          if (role.name === 'ROLE_EXPERT') {
            isScientist = true
          }
        }
        if (isScientist === true) {
          expertAnswers.push(a)
          isScientist = false
        } else {
          communityAnswers.push(a)
        }
      }
      const allAnswers = (expertAnswers.sort((a, b) => new Date(b.created) - new Date(a.created)))
      communityAnswers = communityAnswers.sort((a, b) => new Date(b.created) - new Date(a.created))
      for (const answer of communityAnswers) {
        allAnswers.push(answer)
      }
      return allAnswers
    },
    highestVotedAnswersFirst () {
      const expertAnswers = []
      const communityAnswers = []
      let isScientist = false

      for (const a of this.question.answers) {
        for (const role of a.user.roles) {
          if (role.name === 'ROLE_EXPERT') {
            isScientist = true
          }
        }
        if (isScientist === true) {
          expertAnswers.push(a)
          isScientist = false
        } else {
          communityAnswers.push(a)
        }
      }
      const tmp = (expertAnswers.sort((a, b) => b.votes.upCount - a.votes.upCount))
      for (const answer of (communityAnswers.sort((a, b) => b.votes.upCount - a.votes.upCount))) {
        tmp.push(answer)
      }
      return tmp
    },
    answers () {
      if (this.sortStrategy === 'highestVoted') {
        return this.highestVotedAnswersFirst
      } else if (this.sortStrategy === 'newest') {
        return this.newestAnswersFirst
      } else if (this.sortStrategy === 'oldest') {
        return this.oldestAnswersFirst
      }
    },
    expertAnswerNumber () {
      let n = 0
      for (const a of this.question.answers) {
        for (const role of a.user.roles) {
          if (role.name === 'ROLE_SCIENTIST' || role.name === 'ROLE_EXPERT') {
            n += 1
          }
        }
      }
      return n
    },

    rowPadding () {
      if (this.$vuetify.breakpoint.xs) {
        return 'px-5'
      } else {
        return 'pa-5'
      }
    }
  },
  methods: {

    renderAnswerComment () {
      if (this.answerCommentary === false) {
        this.answerCommentary = true
      } else { this.answerCommentary = false }
    },

    commentAnswer (answer, comment) {
      if (this.$auth.loggedIn) {
        this.$apollo.mutate({
          mutation: gql`
                            mutation(
                                $id: ID!
                                $content: String!
                            ) {
                                commentAnswer(
                                    id: $id,
                                    content: $content
                                ) {
                                    comments {
                                        id
                                        content
                                        created
                                        user {
                                            username
                                        }
                                    }
                                }
                            }
                        `,
          variables: {
            id: answer.id,
            content: answer.comment
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          answer.comments = response.data.commentAnswer.comments
          answer.comment = ''
        })
      }
    },

    deleteAnswer (answer) {
      if (this.$auth.loggedIn && (this.$auth.user.roles.includes('ROLE_ADMIN') || this.$auth.user.roles.includes('ROLE_MODERATOR'))) {
        this.$apollo.mutate({
          mutation: gql`
                            mutation(
                                $id: ID!
                            ) {
                                deleteAnswer(
                                    id: $id
                                ) {
                                    answers {
                                        id
                                        content
                                        created
                                        user {
                                            username
                                        }
                                        votes {
                                            upCount
                                            downCount
                                        }
                                        comments {
                                            id
                                            content
                                            created
                                            user {
                                                username
                                            }
                                        }
                                    }
                                }
                            }
                        `,
          variables: {
            id: answer.id
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          if (response.data.deleteAnswer) {
            this.question.answers = response.data.deleteAnswer.answers
          }
        })
      }
    }
  }
}

</script>

<style scoped>

</style>
