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
    max-width="600"
    height="80vh"
    persistent
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ info }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="$emit('click-abort')"
        >
          {{ $t('general_abort') }}
        </v-btn>
        <v-btn
          :color="color"
          @click="$emit('click-submit')"
        >
          {{ submit }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'OgrDialogConfirm',
  data () {
    return {
    }
  },

  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    color: {
      type: String,
      required: false,
      default: 'secondary'
    },
    title: {
      type: String,
      required: false,
      default: '---'
    },
    info: {
      type: String,
      required: false,
      default: '---'
    },
    submit: {
      type: String,
      required: false,
      default: '---'
    }
  }
}

</script>
