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
    <v-card
      v-ripple="false"
      class="mb-2 mt-3"
      shaped
      :color="color.card"
    >
      <v-card-text class="mb-0 pb-0 black--text">
        <span v-html="linkify(answerData.content)"></span>
      </v-card-text>
      <v-card-text v-if="answerData.wms.length > 0" class="mb-0 pb-0 black--text">
        <ogr-forum-answer-layer-panel :wms="answerData.wms" :color="color.card" />
      </v-card-text>
      <v-card-title class="mt-0 pt-0 mb-1 pb-0" align="end">
        <v-spacer />
        <v-chip class="mr-1" x-small>
          <v-icon left small>
            {{ mdiCalendar }}
          </v-icon>
          {{ answerData.created | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
        </v-chip>
        <v-chip
          x-small
          :to="`/user/${answerData.user.username}`"
        >
          <v-icon left small>
            {{ accountIcon() }}
          </v-icon>
          {{ answerData.user.username }}
        </v-chip>
        <ogr-forum-content-menu
          :id="answerData.id"
          report-type="answer"
          @forum-input-dialog-opened="$emit('forum-input-dialog-opened')"
          @forum-input-dialog-closed="$emit('forum-input-dialog-closed')"
        />
      </v-card-title>

      <v-card-actions
        color="primary"
      >
          <ogr-forum-chip-votes
            :id="answerData.id"
            post-type="POST_TYPE_ANSWER"
            :up="answerData.votes.upCount"
            :down="answerData.votes.downCount"
          />
          <v-spacer />
          <v-btn
            v-if="comments.length > 0"
            v-ripple="false"
            small
            plain
            :color="color.button"
            @click="toggle"
          >
            {{ expand ? $t('hide_comments') : comments.length + ' ' + $t('show_comments') }}
            <v-icon>{{ expand ? mdiChevronUp : mdiChevronDown }}</v-icon>
          </v-btn>
          <v-btn
            v-if="!showCommentInput && comments.length === 0"
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
          <ogr-forum-comment-input
            v-if="showCommentInput && comments.length === 0"
            :id="answerData.id"
            :comments="comments"
            comment-type="ANSWER_COMMENT"
            @click-comment-cancel="showCommentInput = false"
            @update-comments="updateComments"
          />

      </v-card-actions>
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
              comment-type="answerComment"
            />
          </v-row>
          <v-row no-gutters v-if="!showCommentInput && comments.length > 0">
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
            :id="answerData.id"
            :comments="comments"
            comment-type="ANSWER_COMMENT"
            @click-comment-cancel="showCommentInput = false"
            @update-comments="updateComments"
          />
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import { mdiCalendar, mdiAccount, mdiChevronUp, mdiChevronDown, mdiChatPlus } from '@mdi/js'
import commentAnswer from '~/apollo/mutations/commentAnswer.gql'
import OgrForumChipVotes from './OgrForumChipVotes'
import OgrForumContentMenu from './OgrForumContentMenu'
import OgrForumComment from './OgrForumComment'
import OgrForumCommentInput from './OgrForumCommentInput'
import { linkify } from '@/util/ogr-utils'
import OgrForumAnswerLayerPanel from '~/components/ogr/forum/OgrForumAnswerLayerPanel'

export default {
  name: 'OgrForumAnswerWithComments',
  components: { OgrForumAnswerLayerPanel, OgrForumCommentInput, OgrForumComment, OgrForumContentMenu, OgrForumChipVotes },
  props: {
    expert: {
      type: Boolean,
      required: false,
      default: false
    },
    answerData: {
      type: Object,
      required: true,
      default: () => { return {} }
    }
  },

  data () {
    return {
      ogrMapUrl: this.$config.ogrMapUrl,
      mdiCalendar,
      mdiAccount,
      mdiChevronUp,
      mdiChevronDown,
      mdiChatPlus,
      expand: false,
      input: false,
      post: '',
      rules: {
        length: len => v => (v || '').length <= len || this.$t('input_text_length', [len])
      },
      comments: [],
      loading: false,
      showCommentInput: false,
      color: {
        card: '',
        button: 'secondary'
      }
    }
  },

  mounted () {
    this.setComments(this.answerData.comments)
    this.setColors()
  },

  methods: {
    linkify (inputText) {
      return linkify(inputText, this.ogrMapUrl)
    },
    accountIcon () {
      let icon = 'mdi-account'
      for (const role of this.answerData.user.roles) {
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
    openForumInputDialog () {
      this.input = true
      this.$emit('forum-input-dialog-opened')
    },
    closeForumInputDialog () {
      this.input = false
      this.$emit('forum-input-dialog-closed')
    },
    isExpert () {
      let isExpert = false
      for (const role of this.answerData.user.roles) {
        if (role.name === 'ROLE_EXPERT') {
          isExpert = true
        }
      }
      return isExpert
    },
    setColors () {
      const roles = []
      for (const role of this.answerData.user.roles) {
        roles.push(role.name)
      }
      if (roles.includes('ROLE_EXPERT')) {
        this.color.card = '#D3FF87'
        this.color.button = 'neutral'
      }
      if (roles.includes('ROLE_ADMIN')) {
        // this.color.card = '#FFF88F' Teacher
        this.color.card = '#FFFFBA'
        this.color.button = '#5a5a5a'
      }
    },
    toggle () {
      this.expand = this.expand !== true
    },
    setComments (comments) {
      this.comments = comments.sort(function (a, b) {
        return a.id - b.id
      })
    },
    sendPost () {
      if (this.$auth.loggedIn && this.$nuxt.isOnline) {
        if (this.post.length <= 250 || this.post.length > 0) {
          this.loading = true
          this.$nuxt.$emit('loading-start')
          this.$apollo.mutate({
            mutation: commentAnswer,
            variables: {
              id: this.answerData.id,
              content: this.post
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            this.setComments(response.data.commentAnswer.comments)
            this.post = ''
            this.$nuxt.$emit('loading-status', { status: true, message: this.$t('loading_success_messsage_standard') })
            this.loading = false
            this.closeForumInputDialog()
            this.expand = true
          }).catch(() => {
            this.$nuxt.$emit('loading-status', { status: false, message: this.$t('loading_error_messsage_standard') })
            this.loading = false
            this.closeForumInputDialog()
          })
        }
      }
    },
    updateComments (val) {
      this.comments = val
      this.showCommentInput = false
    }
  }
}
</script>

<style>

</style>
