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
    <v-container class="pl-1">
      <v-row :class="answerColor">
        <v-col cols="2">
          <ogr-answer-votes :answer="answer">
          </ogr-answer-votes>
        </v-col>
        <v-col cols="10">
          <v-card-text class="pb-0 pl-0">
            <span v-html="linkify(answer.content)"></span>
          </v-card-text>
          <v-chip x-small >
              <v-icon left small>
                mdi-calendar
              </v-icon>
              {{answer.created | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm')}}
          </v-chip>
          <v-chip class="ma-1" x-small :to="`/user/${answer.user.username}`">
            <v-icon
              left
              small
            >
              {{answerBadge}}
            </v-icon>
            {{answer.user.username}}
          </v-chip>
          <ogr-options-menu
            v-if="this.$auth.loggedIn"
            icon-size="normal"
            :type="answer.__typename"
            :id="parseInt(answer.id)"
            :user="answer.user.username"
          ></ogr-options-menu>
          <!-- Admin menu -->
              <v-menu
                v-if="this.$auth.loggedIn && (this.$auth.user.roles.includes('ROLE_ADMIN') || this.$auth.user.roles.includes('ROLE_MODERATOR') || this.$auth.user.roles.includes('ROLE_EDITOR'))"
                offset-y
                bottom
                right
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon small>
                      mdi-wrench
                    </v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item
                    dense
                    @click="deleteAnswer()"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
          </v-col>
      </v-row>
      <v-row>
      <ogr-comments :comments="answer.comments"></ogr-comments>
      </v-row>
      <v-card-text>
        <v-form
          v-if="this.$auth.loggedIn"
          dense
        >
          <v-row>
            <v-col cols="10">
              <v-btn
                v-if="!commentField"
                class="text-decoration-underline grey--text"
                elevation="0"
                x-small
                @click="commentField = !commentField"
              >
                  {{$t('ogr_add_comment')}}
              </v-btn>
              <v-textarea
                v-if="commentField"
                v-model="newComment"
                :label="$t('ogr_leave_comment')"
                :rules="[v => (v || '' ).length <= 250 || $t('ogr_limit_comment')]"
                rows="1"
                outlined
                dense
                auto-grow
                single-line
                counter="250"
                :disabled="loading"
              />
            </v-col>
            <v-col cols="2">
              <v-btn
                v-if="commentField"
                color="Submit"
                icon
                medium
                :disabled="disabled"
                :loading="loading"
                @click="commentAnswer(answer, newComment)"
              >
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
              <v-btn
                v-if="commentField"
                icon
                small
                :disabled="disabled"
                @click="showCommentField(false)"
              >
                <v-icon>mdi-cancel</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
    </v-container>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Vue2Filters from 'vue2-filters'
import { linkify } from '../../../util/ogr-utils'
import OgrOptionsMenu from '@/components/ogr/comments/OgrOptionsMenu'

export default {
  name: 'OgrQuestionPanelAnswer',
  components: { OgrOptionsMenu },
  mixins: [Vue2Filters.mixin],
  props: {
    answer: Object
  },
  data: function () {
    return {
      ogrMapUrl: this.$config.ogrMapUrl,
      roles: [],
      commentField: false,
      newComment: '',
      disabled: true,
      loading: false,
      text: 'Some kind of text with url www.google.com'
    }
  },

  computed: {
    answerColor () {
      if (this.answer.user) {
        for (const role of this.answer.user.roles) {
          if (role.name == 'ROLE_EXPERT') {
            return 'green lighten-4'
          }
        }
      }
    },
    answerBadge () {
      for (const role of this.answer.user.roles) {
        if (role.name == 'ROLE_EXPERT') {
          return 'mdi-account-star'
        } else if (role.name == ('ROLE_ADMIN' || 'ROLE_EDITOR' || 'ROLE_MODERATOR')) {
          return 'mdi-account-wrench'
        } else {
          return 'mdi-account'
        }
      }
    }
  },
  watch: {
    newComment: function () {
      if (this.newComment.length > 250 || this.newComment.length === 0) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    }
  },

  methods: {
    linkify (inputText) {
      return linkify(inputText, this.ogrMapUrl)
    },
    makeLink (val) {
      return val
    },
    showCommentField (show) {
      if (!show) {
        this.newComment = ''
      }
      this.commentField = show
    },

    commentAnswer (answer, comment) {
      this.loading = true
      this.disabled = true
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
            content: comment
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          answer.comments = response.data.commentAnswer.comments
          this.newComment = ''
          this.showCommentField(false)
          this.loading = false
          this.disabled = false
        })
      }
    },

    deleteAnswer () {
      this.$emit('deleteAnswer', this.answer)
    }
  }
}

</script>

<style scoped>

</style>
