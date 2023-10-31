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
    <v-list-item class="pa-0 ma-0">
      <v-switch
        style="justify-content: flex-start"
        class="pa-0 ma-0 ml-5"
        v-model="unanswered"
        color="info"
        :label="$t('user_profile_tooltip_toggle')"
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
    <template v-for="q in sortedQuestions">
      <ogr-forum-question-preview
        :question="q"
        :key="q.id"
      ></ogr-forum-question-preview>
    </template>
  </v-container>
</template>

<script>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import questionsByBookmarkByUsername from '~/apollo/queries/questionsByBookmarkByUsername.gql'
import OgrForumQuestionPreview from '@/components/ogr/forum/OgrForumQuestionPreview'

export default {
  name: 'UserProfileAnswers',

  components: { OgrForumQuestionPreview },

  props: {
    userData: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  data () {
    return {
      mdiChevronUp,
      mdiChevronDown,
      questions: [],
      expand: null,
      ogrApiUrl: this.$config.ogrApiUrl,
      unanswered: false,
      sortStrategy: 'newest'
    }
  },

  computed: {
    oldestQuestionsFirst () {
      if (this.unanswered) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.unansweredQuestions.sort((a, b) => new Date(a.datastream.resultTime) - new Date(b.datastream.resultTime))
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.questions.sort((a, b) => new Date(a.datastream.resultTime) - new Date(b.datastream.resultTime))
    },
    newestQuestionsFirst () {
      if (this.unanswered) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.unansweredQuestions.sort((a, b) => new Date(a.datastream.resultTime) - new Date(b.datastream.resultTime)).reverse()
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.questions.sort((a, b) => new Date(a.datastream.resultTime) - new Date(b.datastream.resultTime)).reverse()
    },
    highestVotedQuestionsFirst () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      if (this.unanswered) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.unansweredQuestions.sort((a, b) => (b.votes.upCount - b.votes.downCount) - (a.votes.upCount - a.votes.downCount))
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.questions.sort((a, b) => (b.votes.upCount - b.votes.downCount) - (a.votes.upCount - a.votes.downCount))
    },
    unansweredQuestions () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.questions.filter((a) => {
        for (const answer of a.answers) {
          for (const role of answer.user.roles) {
            if (role.name === 'ROLE_EXPERT') {
              return true
            }
          }
        }
        return false
      })
    },
    sortedQuestions () {
      if (this.sortStrategy === 'highestVoted') {
        return this.highestVotedQuestionsFirst
      } else if (this.sortStrategy === 'newest') {
        return this.newestQuestionsFirst
      } else {
        return this.oldestQuestionsFirst
      }
    }
  },

  mounted () {
    this.getQuestions()
  },

  methods: {
    getQuestions () {
      this.$apollo.query({
        query: questionsByBookmarkByUsername,
        variables: {
          username: this.userData.username
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.questions = response.data.questionsByBookmarkByUsername
      })
    }
  }
}
</script>
