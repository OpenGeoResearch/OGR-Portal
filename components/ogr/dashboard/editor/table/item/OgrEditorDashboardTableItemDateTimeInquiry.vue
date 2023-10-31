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
    <span>{{ datetime | dateParse('YYYY-MM-DD HH:mm') | dateFormat('DD. MMMM YYYY - HH:mm') }}</span>
    <v-menu v-if="rejected" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <span
          class="font-weight-bold warning--text"
          v-bind="attrs"
          v-on="on"
        >
          (keine Antwort)
        </span>
      </template>
      <v-card>
        <v-card-text>
          {{ comment === '' ? 'Keine Nachricht angegeben' : comment }}
        </v-card-text>
      </v-card>
    </v-menu>
    <span v-else class="font-weight-bold">(<span :class="elapsedTime > 7 ? 'warning--text' : 'primary--text'">{{ elapsedTime }}</span> Tage)</span>
  </div>
</template>

<script>

export default {
  name: 'OgrEditorDashboardTableItemDateTimeInquiry',
  data () {
    return {
      elapsedTime: 0
    }
  },

  props: {
    datetime: {
      type: String,
      required: true,
      default: '1970-01-01T00:00:00Z'
    },
    rejected: {
      type: Boolean,
      required: true,
      default: false
    },
    comment: {
      type: String,
      required: false,
      default: '---'
    }
  },

  mounted () {
    this.elapsedTime = this.calcElapsedTime(this.datetime)
  },

  methods: {
    calcElapsedTime (datetime) {
      return Math.round((Date.now() - Date.parse(datetime)) / (1000 * 60 * 60 * 24))
    }
  }
}

</script>
