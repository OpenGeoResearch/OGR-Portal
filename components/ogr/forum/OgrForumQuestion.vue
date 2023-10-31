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
    v-ripple="false"
    class="mb-0 mt-1 pa-2"
    elevation="0"
  >
    <v-card-text class="pa-0">
      <ogr-forum-question-images
        :images="images"
      />
    </v-card-text>
    <v-card-title class="pa-0 mt-0 mb-0" style="word-break: break-word;">
      <v-chip
        class="mt-1 pb-0 mb-0"
        label
        small
        color="highlight"
      >
        {{ category }}
      </v-chip>
      <v-spacer />
      <v-icon
        v-if="this.$auth.loggedIn && this.$nuxt.isOnline"
        :color="bookmarked ? 'primary' : 'neutral'"
        @click="bookmark(!bookmarked)"
      >
        {{ bookmarked ? mdiBookmarkCheck : mdiBookmark }}
      </v-icon>

      <ogr-question-action-interesting
          class="ml-3"
          v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EDITOR')"
          :id="id"
          @update-functional-tags="$emit('update-functional-tags')"
      />

      <ogr-question-menu-editor
        class="ml-2"
        v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EDITOR')"
        :id="id"
        :classification="category"
        :semantic-tags="semanticTags"
        :functional-tags="functionalTags"
        @update-semantic-tags="$emit('update-semantic-tags')"
        @update-functional-tags="$emit('update-functional-tags')"
      />

      <ogr-forum-content-menu
        :id="id"
        report-type="question"
        @forum-input-dialog-opened="$emit('forum-input-dialog-opened')"
        @forum-input-dialog-closed="$emit('forum-input-dialog-closed')"
      />
    </v-card-title>
    <v-card-title class="pa-0 mt-0" style="word-break: break-word;" @click="toggleQuestions">
      {{ question }}
    </v-card-title>
    <v-card-text class="pa-0 mb-0 font-weight-regular black--text" style="word-break: break-word;">
      {{ description }}
    </v-card-text>
    <v-card-actions class="pa-0 mb-0 mt-1 pr-4 mr-3">
      <v-spacer />
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
        {{ resultTime | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
      </v-chip>
      <v-chip
        v-if="user"
        class="mx-1"
        x-small
        :to="`/user/${user.username}`"
      >
        <v-icon
          left
          small
        >
          {{ accountIcon(user) }}
        </v-icon>
        {{ user.username }}
      </v-chip>
    </v-card-actions>

    <v-card-text class="pa-0 mt-2 mb-2" style="word-break: break-word;">
      <ogr-forum-question-tags
        :semantic-tags="semanticTags"
        :functional-tags="functionalTags"
      />
    </v-card-text>

    <ogr-forum-series-info
      v-if="isSeriesParent || isSeriesChild"
      :series-tag="seriesTag"
      :is-series-parent="isSeriesParent"
    />
    <v-list-item
      class="pa-0"
      color="primary"
    >
      <v-list-item-subtitle>
        <v-row no-gutters>
          <ogr-forum-chip-votes
            :id="id"
            post-type="POST_TYPE_QUESTION"
            :up="votes.upCount"
            :down="votes.downCount"
          />
          <v-spacer />
          <ogr-social-sharing class="mr-2" />
        </v-row>
      </v-list-item-subtitle>
    </v-list-item>

    <v-card-actions class="pa-0 mb-0 mt-1">
      <v-spacer />
      <v-btn
        v-if="comments.length > 0"
        v-ripple="false"
        small
        plain
        color="secondary"
        @click="toggleComments"
      >
        {{ expand ? $t('hide_comments') : comments.length + ' ' + $t('show_comments') }}
        <v-icon>{{ expand ? mdiChevronUp : mdiChevronDown }}</v-icon>
      </v-btn>
      <v-btn
        v-if="comments.length === 0 && !showCommentInput"
        small
        plain
        color="neutral"
        :disabled="!(this.$auth.loggedIn && this.$nuxt.isOnline)"
        @click="showCommentInput = true"
      >
        {{ $t('forum_add_comment') }}
        <v-icon class="ml-1">
          {{ mdiChatPlus }}
        </v-icon>
      </v-btn>
      <v-spacer />
    </v-card-actions>
    <ogr-forum-comment-input
      v-if="comments.length === 0 && showCommentInput"
      :id="id"
      comment-type="QUESTION_COMMENT"
      @click-comment-cancel="showCommentInput = false"
      @update-comments="updateComments"
    />

    <v-expand-transition>
      <div v-show="expand" class="pb-1 pr-1">
        <v-row
          v-for="(comment, i) in comments"
          :key="i"
          no-gutters
        >
          <v-spacer />
          <ogr-forum-comment
            class="ma-1"
            :comment-data="comment"
            comment-type="questionComment"
          />
        </v-row>
        <v-row no-gutters v-if="!showCommentInput">
          <v-spacer />
          <v-btn
            small
            plain
            color="neutral"
            :disabled="!(this.$auth.loggedIn && this.$nuxt.isOnline)"
            @click="showCommentInput = true"
          >
            {{ $t('forum_add_comment') }}
            <v-icon class="ml-1">
              {{ mdiChatPlus }}
            </v-icon>
          </v-btn>
        </v-row>
        <ogr-forum-comment-input
          v-else
          :id="id"
          comment-type="QUESTION_COMMENT"
          @click-comment-cancel="showCommentInput = false"
          @update-comments="updateComments"
        />
      </div>
    </v-expand-transition>

    <v-divider></v-divider>
  </v-card>
</template>

<script>
import { mdiCalendar, mdiAccount, mdiChevronUp, mdiChevronDown, mdiClose, mdiChatPlus, mdiBookmark, mdiBookmarkCheck, mdiDotsVertical } from '@mdi/js'
import commentQuestion from '~/apollo/mutations/commentQuestion.gql'
import isQuestionBookmarked from '~/apollo/queries/isQuestionBookmarked.gql'
import questionBookmark from '~/apollo/mutations/questionBookmark.gql'
import OgrForumQuestionImages from './OgrForumQuestionImages'
import OgrForumContentMenu from './OgrForumContentMenu'
import OgrForumQuestionTags from './OgrForumQuestionTags'
import OgrForumChipVotes from './OgrForumChipVotes'
import OgrSocialSharing from '../comments/OgrSocialSharingButtons'
import OgrForumComment from './OgrForumComment'
import OgrQuestionMenuEditor from '../action/OgrQuestionMenuEditor'
import OgrQuestionActionInteresting from '../action/OgrQuestionActionInteresting'
import OgrForumCommentInput from './OgrForumCommentInput'
import OgrForumSeriesInfo from '@/components/ogr/forum/OgrForumSeriesInfo'

export default {

  name: 'OgrForumQuestion',
  components: { OgrForumSeriesInfo, OgrForumCommentInput, OgrQuestionActionInteresting, OgrQuestionMenuEditor, OgrForumComment, OgrSocialSharing, OgrForumChipVotes, OgrForumQuestionTags, OgrForumContentMenu, OgrForumQuestionImages },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    id: {
      required: true,
      default: null
    },
    question: {
      type: String,
      required: false,
      default: ''
    },
    description: {
      type: String,
      required: false,
      default: ''
    },
    category: {
      type: String,
      required: true,
      default: ''
    },
    images: {
      type: Array,
      required: true,
      default: () => { return [] }
    },
    votes: {
      type: Object,
      required: true,
      default: () => { return {} }
    },
    resultTime: {
      type: String,
      required: true,
      default: ''
    },
    user: {
      type: Object,
      required: true,
      default: () => { return {} }
    },
    commentData: {
      type: Array,
      required: true,
      default: () => { return [] }
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
      mdiCalendar,
      mdiAccount,
      mdiChevronUp,
      mdiChevronDown,
      mdiClose,
      mdiChatPlus,
      mdiBookmark,
      mdiBookmarkCheck,
      mdiDotsVertical,
      expand: false,
      show: false,
      active: false,
      source: undefined,
      input: false,
      post: '',
      rules: {
        length: len => v => (v || '').length <= len || this.$t('input_text_length', [len])
      },
      comments: [],
      loading: false,
      bookmarked: false,
      showCommentInput: false,
      tags: [],
      isSeriesParent: false,
      isSeriesChild: false
    }
  },

  computed: {
    seriesTag () {
      for (let i = 0; i < this.semanticTags.length; i++) {
        if (this.semanticTags[i].result.substring(0, 2) === 's_') {
          return this.semanticTags[i].result
        }
      }
      return ''
    }
  },

  mounted () {
    this.setComments(this.commentData)
    this.isBookmarked()
    this.tags = []
    for (let i = 0; i < this.functionalTags.length; i++) {
      this.tags.push(this.functionalTags[i].result)
    }
    this.checkSeries()
  },

  methods: {
    checkSeries () {
      this.isSeriesParent = this.tags.includes('series-parent')
      this.isSeriesChild = this.tags.includes('series-child')
    },
    isBookmarked () {
      if (this.$auth.loggedIn && this.$nuxt.isOnline) {
        this.$apollo.query({
          query: isQuestionBookmarked,
          variables: {
            id: this.id
          },
          fetchPolicy: 'no-cache',
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.bookmarked = response.data.isQuestionBookmarked
        })
      }
    },
    bookmark (val) {
      this.bookmarked = val
      if (this.$auth.loggedIn && this.$nuxt.isOnline) {
        this.$apollo.mutate({
          mutation: questionBookmark,
          variables: {
            id: this.id,
            bookmark: val
          },
          fetchPolicy: 'no-cache',
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.bookmarked = response.data.questionBookmark
        })
      }
    },
    openForumInputDialog () {
      this.input = true
      this.$emit('forum-input-dialog-opened')
    },
    closeForumInputDialog () {
      this.input = false
      this.$emit('forum-input-dialog-closed')
    },
    setComments (comments) {
      this.comments = comments.sort(function (a, b) {
        return a.id - b.id
      })
    },
    toggleComments () {
      this.expand = this.expand !== true
    },
    toggleQuestions () {
      this.show = this.show !== true
    },
    preview (url) {
      return url + '?size=preview'
    },
    medium (url) {
      return url + '?size=medium'
    },
    showMediaDisplay (j) {
      this.source = this.medium(this.images[j])
      this.active = true
    },
    accountIcon (user) {
      let icon = 'mdi-account'
      for (const role of this.user.roles) {
        if (role.name === 'ROLE_EXPERT') {
          icon = 'mdi-account-school'
        } else if (role.name === 'ROLE_EDITOR' && icon !== 'mdi-account-school') {
          icon = 'mdi-account-edit'
        } else if (role.name === 'ROLE_ADMIN' && icon !== 'mdi-account-school') {
          icon = 'mdi-account-cowboy-hat'
        }
      }
      return icon
    },
    sendPost () {
      if (this.$auth.loggedIn && this.$nuxt.isOnline) {
        if (this.post.length <= 250 || this.post.length > 0) {
          this.loading = true
          this.$nuxt.$emit('loading-start')
          this.$apollo.mutate({
            mutation: commentQuestion,
            variables: {
              id: this.id,
              content: this.post
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            this.setComments(response.data.commentQuestion.comments)
            this.post = ''
            this.$nuxt.$emit('loading-status', {
              status: true,
              message: this.$t('loading_success_messsage_standard')
            })
            this.loading = false
            this.closeForumInputDialog()
            this.expand = true
          }).catch(() => {
            this.$nuxt.$emit('loading-status', {
              status: false,
              message: this.$t('loading_error_messsage_standard')
            })
            this.loading = false
            this.closeForumInputDialog()
          })
        }
      }
    },
    updateComments (val) {
      this.comments = val
      this.showCommentInput = false
      this.expand = true
    }
  }
}
</script>
