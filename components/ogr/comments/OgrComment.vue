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
  <v-card-text
    :key="comment.id"
    class="text-caption py-0"
  >
    <span v-html="linkify(comment.content)"></span> - {{comment.created | dateParse('YYYY.MM.DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm')}}
    <nuxt-link :to="`/user/${comment.user.username}`">
      {{comment.user.username}}
    </nuxt-link>
    <ogr-options-menu
      v-if="this.$auth.loggedIn"
      icon-size="small"
      :type="comment.__typename"
      :id="parseInt(comment.id)"
      :user="comment.user.username"
    ></ogr-options-menu>
    <v-menu
      v-if="this.$auth.loggedIn && (this.$auth.user.username == comment.user.username || this.$auth.user.roles.includes('ROLE_MODERATOR'))"
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
          @click="deleteComment(comment)"
        >
          <v-list-item-icon>
            <v-icon small>mdi-close</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card-text>
</template>

<script>
import OgrOptionsMenu from '@/components/ogr/comments/OgrOptionsMenu'

import { linkify } from '../../../util/ogr-utils'

export default {
  name: 'OgrComment',

  components: { OgrOptionsMenu },

  props: {
    comment: Object
  },

  data () {
    return {
      ogrMapUrl: this.$config.ogrMapUrl
    }
  },

  methods: {
    deleteComment () {
      this.$emit('deleteComment', this.comment)
    },
    linkify (inputText) {
      return linkify(inputText, this.ogrMapUrl)
    }
  }
}

</script>

<style scoped>

</style>
