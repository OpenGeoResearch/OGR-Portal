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
    :value="show"
    :persistent="loading"
    width="350"
    height="200"
  >
    <v-card
      width="350"
      height="200"
    >
      <v-card-text align="center">
        <v-progress-circular
          class="mt-5"
          :size="75"
          :color="loading ? 'secondary' : 'neutral'"
          :indeterminate="loading"
        >
          <v-icon
            v-if="success === true"
            :size="70"
            color="primary"
          >
            {{ mdiCheck }}
          </v-icon>
          <v-icon
            v-if="error === true"
            :size="45"
            color="info"
          >
            {{ mdiAlert }}
          </v-icon>
        </v-progress-circular>
      </v-card-text>
      <v-card-text v-if="success === false && error === false" align="center" class="mt-0 pt-0">
        <span :class="description === '' ? 'white--text' : ''">{{ description }}</span>
      </v-card-text>
      <v-card-text v-if="success === true" align="center" class="mt-0 pt-0">
        {{ successMessage }}
      </v-card-text>
      <v-card-text v-if="error === true" align="center" class="mt-0 pt-0">
        {{ errorMessage }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { mdiCheck, mdiAlert } from '@mdi/js'

export default {
  name: 'OgrDialogLoading',

  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    success: {
      type: Boolean,
      required: true,
      default: false
    },
    error: {
      type: Boolean,
      required: true,
      default: false
    },
    description: {
      type: String,
      required: false,
      default: ''
    },
    successMessage: {
      type: String,
      required: false
    },
    errorMessage: {
      type: String,
      required: false
    }
  },

  data () {
    return {
      mdiCheck,
      mdiAlert,
      loading: true,
      dialog: false
    }
  },

  watch: {
    success () {
      this.loading = false
    },
    error () {
      this.loading = false
    },
    show () {
      this.loading = true
    }
  }
}
</script>
