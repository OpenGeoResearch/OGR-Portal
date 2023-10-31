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
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
        @click="reject"
      >
        <v-icon
          large
          color="negative"
        >
          mdi-tooltip-remove
        </v-icon>
      </v-btn>
    </template>
    <span>Keine Antwort geben</span>
  </v-tooltip>
</template>

<script>

export default {
  name: 'OgrExpertDashboardActionReject',
  data () {
    return {}
  },

  props: {
    id: {
      type: String,
      required: true,
      default: null
    }
  },

  methods: {
    reject () {
      this.$store.commit('editor-dashboard/setRejectQuestion', this.id)
      this.$emit('reject-dialog-open')
    }
  }
}

</script>
