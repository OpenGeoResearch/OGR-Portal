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
  <v-container class="py-0">
    <v-card
      outlined
      min-width="95%"
    >
      <template
        v-if="!showAll"
        v-for="comment in oldestCommentFirstShort"
      >
        <ogr-comment
          :comment="comment"
          @deleteComment="deleteComment"
        ></ogr-comment>
      </template>

      <template
        v-if="showAll"
        v-for="comment in oldestCommentFirst"
      >
        <ogr-comment :comment="comment"></ogr-comment>
      </template>

      <v-btn
        v-if="!showAll && oldestCommentFirst.length>3"
        class="text-decoration-underline grey--text"
        elevation="0"
        x-small
        @click="showComments"
      >
        {{$t('ogr_show_more_comment')}}
      </v-btn>
      <v-btn
        v-if="showAll"
        class="text-decoration-underline grey--text"
        elevation="0"
        x-small
        @click="hideComments"
      >
        {{$t('ogr_hide_comment')}}
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import Vue2Filters from 'vue2-filters'
import OgrOptionsMenu from '@/components/ogr/comments/OgrOptionsMenu'
import gql from 'graphql-tag'
import OgrComment from '@/components/ogr/comments/OgrComment'

export default {
  components: { OgrComment, OgrOptionsMenu },
  mixins: [Vue2Filters.mixin],
  props: {
    comments: Array
  },
  data: function () {
    return {
      showAll: false
    }
  },
  computed: {
    oldestCommentFirst () {
      // eslint-disable-next-line vue/no-mutating-props,vue/no-side-effects-in-computed-properties
      if (this.comments) {
        return this.comments.sort((a, b) => new Date(a.created) - new Date(b.created))
      }
    },
    oldestCommentFirstShort () {
      if (this.comments) {
        return this.oldestCommentFirst.slice(0, 3)
      }
    }
  },
  methods: {
    deleteComment (comment) {
      if (this.$auth.loggedIn && this.$auth.user.username === comment.user.username) {
        if (comment.__typename === 'AnswerComment') {
          this.$apollo.mutate({
            mutation: gql`
                            mutation(
                                $id: ID!
                            ) {
                                deleteMyAnswerComment(
                                    id: $id
                                ){

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
              id: comment.id
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            if (response.data.deleteMyAnswerComment) {
              this.comments = response.data.deleteMyAnswerComment.comments
            }
          })
        } else if (comment.__typename === 'QuestionComment') {
          this.$apollo.mutate({
            mutation: gql`
                            mutation(
                                $id: ID!
                            ) {
                                deleteMyQuestionComment(
                                    id: $id
                                ){

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
              id: comment.id
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            if (response.data.deleteMyQuestionComment){
              this.comments = response.data.deleteMyQuestionComment.comments
            }
          })
        }
      } else if (this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_MODERATOR')) {
        if (comment.__typename === 'AnswerComment') {
          this.$apollo.mutate({
            mutation: gql`
                            mutation(
                                $id: ID!
                            ) {
                                deleteAnswerComment(
                                    id: $id
                                ){

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
              id: comment.id
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            if (response.data.deleteAnswerComment) {
              this.comments = response.data.deleteAnswerComment.comments
            }
          })
        } else if (comment.__typename === 'QuestionComment') {
          this.$apollo.mutate({
            mutation: gql`
                            mutation(
                                $id: ID!
                            ) {
                                deleteQuestionComment(
                                    id: $id
                                ){

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
              id: comment.id
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            if (response.data.deleteQuestionComment){
              this.comments = response.data.deleteQuestionComment.comments
            }
          })
        }
      }
    },
    showComments () {
      this.showAll = true
    },
    hideComments () {
      this.showAll = false
    }
  }
}

</script>

<style>

</style>
