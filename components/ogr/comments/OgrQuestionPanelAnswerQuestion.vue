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
  <v-card-text>
    <v-form
      class="pa-2 pt-2"
    >
      <v-textarea
        v-model="commentBody"
        :label="$t('ogr_answer_question') | capitalize({ onlyFirstLetter: true })"
        :rules="[v => (v || '' ).length <= 4000 || $t('ogr_limit_answer')]"
        rows="5"
        auto-grow
        dense
        outlined
        :disabled="loading"
        counter="4000"

      >
      </v-textarea>
      <v-btn
        :disabled="disabled"
        :loading="loading"
        color="success"
        @click="comment"
      >
        {{$t('ogr_add_answer')}}
      </v-btn>
    </v-form>
  </v-card-text>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'OgrQuestionPanelAnswerQuestion',
  props: {
    question: Object
  },
  data: function () {
    return {
      commentTitle: '',
      commentBody: '',
      disabled: true,
      loading: false
    }
  },
  watch: {
    commentBody: function () {
      if (this.commentBody.length > 4000 || this.commentBody.length === 0) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    }
  },
  methods: {
    comment () {
      this.loading = true
      this.disabled = true
      this.$apollo.mutate({
        mutation: gql`
                        mutation(
                            $id: ID!
                            $content: String!
                        ) {
                            answerQuestion(
                                id: $id,
                                content: $content
                            ) {
                                answers {
                                    id
                                    content
                                    created
                                    user {
                                        username
                                        roles {
                                            name
                                        }
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
          id: this.question.id,
          content: this.commentBody
        },
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.commentBody = ''
        // eslint-disable-next-line vue/no-mutating-props
        this.question.answers = response.data.answerQuestion.answers
        this.loading = false
        this.disabled = false
      })
    }
  }
}
</script>

<style scoped>

</style>
