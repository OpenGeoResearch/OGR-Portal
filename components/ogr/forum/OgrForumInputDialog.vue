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
  <v-dialog
    :value="active"
    fullscreen
    hide-overlay
    transition="slide-x-reverse-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
        height="56"
      >
        <v-btn
          icon
          dark
          @click="$emit('click-dialog-close')"
        >
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
        <v-spacer />
        <v-btn
          text
          dark
          :disabled="invalid"
          @click="$emit('click-dialog-check')"
        >
          {{ label }}
        </v-btn>
      </v-toolbar>

      <v-container
        fluid
      >
        <v-row>
          <v-col>
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose, mdiCheck } from '@mdi/js'

export default {
  name: 'OgrForumInputDialog',

  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    invalid: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false,
      default: 'Absenden'
    }
  },

  data () {
    return {
      mdiClose,
      mdiCheck
    }
  },

  computed: {
    theme () {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },

  created () {
    this.$nuxt.$on('close-forum-input-dialog', () => {
      this.$emit('click-dialog-close')
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('close-forum-input-dialog')
  }
}
</script>
