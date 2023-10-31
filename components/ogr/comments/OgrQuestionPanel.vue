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
  <div v-if="question" class="headerClass">
    <v-dialog
      v-model="imageViewer"
      width="70vw"
    >
      <ogr-question-image-viewer :images="images" />
    </v-dialog>

    <v-carousel
      v-if="images"
      :height="mediaHeight"
      show-arrows-on-hover
      progress
      hide-delimiters
    >
      <v-carousel-item
        v-for="(image, i) in images"
        :key="image + i"
      >
        <v-img
          style="text-align: start;"
          :src="medium(image)"
          :lazy-src="placeholder"
          height="100%"
          contain
        >
          <v-btn
            v-if="true"
            icon
            dark
            color="error"
            @click="imageViewer = true"
          >
            <v-icon>
              mdi-fullscreen
            </v-icon>
          </v-btn>
        </v-img>
      </v-carousel-item>
    </v-carousel>

    <v-carousel
      v-else
      :height="mediaHeight"
      show-arrows-on-hover
      progress
      hide-delimiters
    >
      <v-carousel-item>
        <v-img
          style="text-align: start;"
          :src="placeholder"
          height="100%"
          contain
        >
        </v-img>
      </v-carousel-item>
    </v-carousel>

    <v-container>
      <v-row justify-space-between>
        <v-col cols="1">
          <ogr-question-votes
            v-if="this.question"
            :question="this.question"
          />
        </v-col>

        <v-col cols="11">
          <v-card-title class="pt-1 pb-0" style="word-break: break-word;">
            {{datastream.name}}
            <template v-if="this.$auth.loggedIn">
              <v-tooltip v-if="isQuestionBookmarked" bottom>
                <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="green"
                  v-bind="attrs"
                  v-on="on"
                  @click="bookmark(false)"
                >
                  mdi-bookmark-check
                </v-icon>
                </template>
                  <span>Lesezeichen entfernen</span>
              </v-tooltip>

              <v-tooltip v-if="!isQuestionBookmarked" bottom>
                <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="bookmark(true)"
                >
                  mdi-bookmark
                </v-icon>
                </template>
                <span>Lesezeichen setzen</span>
              </v-tooltip>
            </template>

            <ogr-question-action-interesting
              class="ml-3"
              v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EDITOR')"
              :id="datastream['@iot.id']"
              @update-functional-tags="$emit('update-functional-tags')"
            />

            <ogr-question-menu-editor
              class="ml-2"
              v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EDITOR')"
              :id="datastream['@iot.id']"
              :classification="classification"
              :semantic-tags="semanticTags"
              :functional-tags="functionalTags"
              @update-semantic-tags="$emit('update-semantic-tags')"
              @update-functional-tags="$emit('update-functional-tags')"
            />

            <OgrOptionsMenu
              v-if="this.$auth.loggedIn"
              icon-size="normal"
              type="Question"
              :id="parseInt(datastream['@iot.id'])"
              :user="this.questioner"
            />

            <v-menu
              v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_ADMIN')"
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
                  @click="deleteQuestion()"
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
          </v-card-title>

          <v-card-title class="py-1 caption">
            <v-chip
              class="disable-events"
              x-small
            >
              <v-icon
                left
                small
              >
                mdi-calendar
              </v-icon>
              {{ datastream.resultTime | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
            </v-chip>
            <v-chip
              v-if="this.question && this.question.user"
              class="mx-1"
              x-small
              :to="`/user/${question.user.username}`"
            >
              <v-icon
                v-if="this.primaryRole === 'ROLE_EXPERT'"
                left
                small
              >
                mdi-account-star
              </v-icon>
              <v-icon
                v-else-if="this.primaryRole === 'ROLE_ADMIN'"
                left
                small
              >
                mdi-account-wrench
              </v-icon>
              <v-icon
                v-else
                left
                small
              >
                mdi-account
              </v-icon>
              {{question.user.username}}
            </v-chip>
            <template v-if="datastream.unitOfMeasurement.symbol !== selectedCategory">
              <v-chip
                color="lime accent-4"
                x-small
                label
                @click="selectCategory(datastream.unitOfMeasurement.symbol)"
              >
                {{classification}}
              </v-chip>
            </template>
            <template v-else>
              <v-chip
                color="primary"
                x-small
                label
                @click="selectCategory(datastream.unitOfMeasurement.symbol)"
              >
                {{classification}}
              </v-chip>
            </template>
          </v-card-title>
            </v-col>
        </v-row>

        <v-card-text>
            <span v-html="linkify(datastream.description)"></span>
        </v-card-text>

        <v-card-text><v-row>
          <div class="text-left" >
            <template v-for="(tag) in semanticTags">
              <template v-if="filteredTags.indexOf(tag.result) >= 0">
                <v-chip
                  :key="tag.result"
                  class="mr-4"
                  color="primary"
                  pill
                  small
                  @click="filterForTag(tag.result)"
                >
                  {{tag.result}}
                </v-chip>
              </template>
                <template v-else>
                  <v-chip
                    :key="tag.result"
                    class="mt-1 mr-4"
                    color="primary"
                    outlined
                    pill
                    small
                    @click="filterForTag(tag.result)"
                  >
                    {{tag.result}}
                  </v-chip>
                </template>
            </template>
          </div>

          <div class="text-left" >
            <template v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EDITOR')">
              <v-chip
                v-for="(tag) in functionalTags"
                :key="tag.result"
                class="mt-1 mr-4"
                color="info"
                outlined
                pill
                small
              >
                {{tag.result}}
              </v-chip>
            </template>
          </div>
        </v-row>
        <OgrSocialSharingButtons class="mt-2" />
      </v-card-text>

        <template v-if="this.question">
          <ogr-comments :comments="question.comments" />

          <v-card-text>
            <v-form
              v-if="this.$auth.loggedIn"
              dense
            >
              <v-row>
                <v-col cols="10">
                  <v-btn
                    v-if="!commentField"
                    class="text-decoration-underline mb-1 grey--text"
                    elevation="0"
                    x-small
                    @click="showCommentField(true)"
                  >
                    {{$t('ogr_add_comment')}}
                  </v-btn>
                  <v-textarea
                    v-if="commentField"
                    v-model="newComment"
                    :label="$t('ogr_leave_comment')"
                    :rules="[v => (v || '' ).length <= 250 || $t('ogr_limit_comment')]"
                    rows="1"
                    auto-grow
                    single-line
                    outlined
                    dense
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
                      @click="commentQuestion(newComment)"
                    >
                      <v-icon>mdi-check-bold</v-icon>
                    </v-btn>

                    <v-btn
                      v-if="commentField"
                      class="ml-1"
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
        </template>

        <v-divider color="light-green lighten-2" />

        <ogr-question-panel-answers
          v-if="this.question"
          :question="this.question"
        >
        </ogr-question-panel-answers>

        <ogr-question-panel-answer-question
          v-if="this.question && this.$auth.loggedIn"
          :question="this.question"
        >
        </ogr-question-panel-answer-question>
    </v-container>
  </div>

  <div v-else>
    <v-skeleton-loader class="mb-3" type="card-avatar, article, card-heading@3, divider, card-heading, list-item-avatar, article, card-heading@3" elevation="2"></v-skeleton-loader>
  </div>
</template>

<script>
import { getCategoryFromCode } from '@/util/ogr-utils'
import question from '~/apollo/queries/question'
import questionBookmark from '@/apollo/mutations/questionBookmark'
import isQuestionBookmarked from '@/apollo/queries/isQuestionBookmarked'
import deleteQuestion from '@/apollo/mutations/deleteQuestion'
import commentQuestion from '@/apollo/mutations/commentQuestion'

import { mapState } from 'vuex'
import OgrQuestionPanelAnswerQuestion from '@/components/ogr/comments/OgrQuestionPanelAnswerQuestion'
import OgrOptionsMenu from '@/components/ogr/comments/OgrOptionsMenu'
import OgrQuestionImageViewer from '@/components/ogr/comments/OgrQuestionImageViewer'
import OgrQuestionVotes from './OgrQuestionVotes'
import OgrComments from './OgrComments'
import OgrQuestionPanelAnswers from './OgrQuestionPanelAnswers'
import OgrQuestionActionInteresting from '../action/OgrQuestionActionInteresting'
import OgrQuestionMenuEditor from '../action/OgrQuestionMenuEditor'

import OgrSocialSharingButtons from '@/components/ogr/comments/OgrSocialSharingButtons'
import { linkify } from '../../../util/ogr-utils'
export default {
  components: { OgrQuestionMenuEditor, OgrQuestionActionInteresting, OgrQuestionPanelAnswers, OgrComments, OgrQuestionVotes, OgrQuestionImageViewer, OgrQuestionPanelAnswerQuestion, OgrOptionsMenu, OgrSocialSharingButtons },
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
      newComment: '',
      commentField: false,
      categorySelected: false,
      placeholder: '/img/ogr_placeholder_2.png',
      ogrApiUrl: this.$config.ogrApiUrl,
      ogrMapUrl: this.$config.ogrMapUrl,
      primaryRole: '',
      disabled: true,
      loading: false,
      dialShare: false,
      imageViewer: false
    }
  },

  apollo: {
    question: {
      query: question,
      prefetch: true,
      variables () {
        return { id: this.datastream['@iot.id'] }
      }
    },
    isQuestionBookmarked: {
      query: isQuestionBookmarked,
      prefetch: true,
      variables () {
        return { id: this.datastream['@iot.id'] }
      },
      skip () {
        return !this.$auth.loggedIn
      },
      context () {
        return {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }
    }
  },

  computed: {
    ...mapState('ogr', ['filteredTags']),
    orientationOfButton () {
      if (this.isMobile()) return 'top'
      else return 'left'
    },
    classification () {
      if (this.datastream && this.datastream.unitOfMeasurement !== undefined) {
        return getCategoryFromCode(this.datastream.unitOfMeasurement.symbol, this.$i18n.locale)
      } else {
        return undefined
      }
    },
    images () {
      return this.datastream.properties.images
    },
    audios () {
      return this.datastream.properties.audios
    },
    videos () {
      return this.datastream.properties.videos
    },

    selectedCategory: {
      get: function () {
        return this.$store.state.ogr.category
      },
      set: function (value) {
        this.$store.commit('ogr/setCategory', value)
        // eslint-disable-next-line no-undef
        $nuxt.$emit('updateLayer', 'OGR')
      }
    },
    mediaHeight () {
      if (this.$vuetify.breakpoint.xs || this.isMobile()) {
        return '200'
      } else {
        return '300'
      }
    },
    questioner () {
      if (this.question.user) {
        return this.question.user.username
      } else {
        return ''
      }
    }
  },
  watch: {
    question () {
      if (this.question.user) {
        this.getRoles()
      }
    },
    newComment: function () {
      this.disabled = this.newComment.length > 250 || this.newComment.length === 0
    }
  },

  methods: {
    test (i) {
      console.log(i)
    },
    linkify (inputText) {
      return linkify(inputText, this.ogrMapUrl)
    },
    copyLink () {
      navigator.clipboard.writeText(this.url)
    },
    getRoles () {
      for (const role of this.question.user.roles) {
        if (role.name === 'ROLE_EXPERT') {
          this.primaryRole = 'ROLE_EXPERT'
        } else if (role.name === 'ROLE_ADMIN' && this.primaryRole !== 'ROLE_EXPERT') {
          this.primaryRole = 'ROLE_ADMIN'
        }
      }
    },
    selectCategory (item) {
      if (this.selectedCategory !== this.datastream.unitOfMeasurement.symbol) {
        this.selectedCategory = this.datastream.unitOfMeasurement.symbol
      } else {
        this.selectedCategory = undefined
      }
    },
    showCommentField (show) {
      if (!show) {
        this.newComment = ''
      }
      this.commentField = show
    },

    filterForTag (tag) {
      // alert("Filtering for tag: " + tag)
      if (this.filteredTags.indexOf(tag) >= 0) {
        this.$store.commit('ogr/removeTag', tag)
      } else {
        this.$store.commit('ogr/addTag', tag)
      }
      // eslint-disable-next-line no-undef
      this.$nuxt.$emit('updateLayer', 'OGR')
      this.$nuxt.$emit('updateLayer', 'OGR_Cluster')
    },

    bookmark (toBookmark) {
      if (this.$auth.loggedIn) {
        this.$apollo.mutate({
          mutation: questionBookmark,
          variables: {
            id: this.datastream['@iot.id'],
            bookmark: toBookmark
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          },
          update: (cache, result) => {
            cache.writeQuery({
              query: isQuestionBookmarked,
              data: { isQuestionBookmarked: result.data.questionBookmark },
              variables: { id: this.datastream['@iot.id'] }
            })
          }
        })
      }
    },

    deleteQuestion () {
      if (this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_ADMIN')) {
        this.$apollo.mutate({
          mutation: deleteQuestion,
          variables: {
            id: this.datastream['@iot.id']
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          if (response.data.deleteQuestion) {
            this.$router.push('/')
            // eslint-disable-next-line no-undef
            $nuxt.$emit('updateLayer', 'OGR', true)
          }
        })
      }
    },

    commentQuestion (newComment) {
      this.loading = true
      this.disabled = true
      if (this.$auth.loggedIn) {
        this.$apollo.mutate({
          mutation: commentQuestion,
          variables: {
            id: this.question.id,
            content: newComment
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.question.comments = response.data.commentQuestion.comments
          this.newComment = ''
          this.showCommentField(false)
          this.loading = false
          this.disabled = false
        })
      }
    },
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    medium (url) {
      return url + '?size=medium'
    }
  }
}

</script>

<style scoped>
.disable-events {
  pointer-events: none
}
.headerClass{
  word-wrap: break-word;
  width: 98%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
