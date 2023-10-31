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
    max-width="80%"
    width="80%"
    v-ripple="false"
    class="mb-2 ml-10 pt-0 pb-0"
    elevation="0"
  >
    <v-card-actions class="mb-0 pb-0">
      <v-textarea
        v-model="newComment"
        :label="$t('ogr_leave_comment')"
        :rules="[v => (v || '' ).length <= 250 || $t('ogr_limit_comment')]"
        rows="1"
        autofocus
        auto-grow
        single-line
        outlined
        dense
        counter="250"
        :disabled="loading"
      />
    </v-card-actions>
    <v-card-actions class="mt-0 pt-0 mb-0 pb-2">
      <v-spacer />
      <v-btn
        class="ml-1"
        small
        :disabled="loading"
        @click="$emit('click-comment-cancel')"
      >
        {{ $t('general_abort') }}
      </v-btn>
      <v-btn
        color="secondary"
        small
        :disabled="disabled"
        :loading="loading"
        @click="addComment(newComment)"
      >
        {{ $t('general_send') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import commentQuestion from '~/apollo/mutations/commentQuestion.gql'
import commentAnswer from '~/apollo/mutations/commentAnswer.gql'

export default {

  name: 'OgrForumCommentInput',

  props: {
    // eslint-disable-next-line vue/require-prop-types
    id: {
      required: true,
      default: null
    },
    commentType: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      newComment: '',
      commentField: false,
      disabled: true,
      loading: false
    }
  },

  watch: {
    newComment: function () {
      this.disabled = this.newComment.length > 250 || this.newComment.length === 0
    }
  },

  methods: {
    addComment (newComment) {
      if (this.commentType === 'QUESTION_COMMENT') {
        this.commentQuestion(newComment)
      } else if (this.commentType === 'ANSWER_COMMENT') {
        this.commentAnswer(newComment)
      }
    },
    commentQuestion (newComment) {
      this.loading = true
      this.disabled = true
      if (this.$auth.loggedIn) {
        this.$apollo.mutate({
          mutation: commentQuestion,
          variables: {
            id: this.id,
            content: newComment
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
          this.$emit('update-comments', response.data.commentQuestion.comments)
        })
      }
    },
    commentAnswer (newComment) {
      this.loading = true
      this.disabled = true
      if (this.$auth.loggedIn) {
        this.$apollo.mutate({
          mutation: commentAnswer,
          variables: {
            id: this.id,
            content: newComment
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
          this.$emit('update-comments', response.data.commentAnswer.comments)
        })
      }
    }
  }
}
</script>
