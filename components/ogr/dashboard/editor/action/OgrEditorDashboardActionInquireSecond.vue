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
      <v-icon
        class="mr-2"
        @click="confirm"
        large
        color="confirm"
        v-bind="attrs"
        v-on="on"
      >
        mdi-send-check
      </v-icon>
    </template>
    <span>An Experten:Innen senden</span>
  </v-tooltip>
</template>

<script>

export default {
  name: 'OgrEditorDashboardActionInquireSecond',
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
    confirm () {
      this.$store.commit('editor-dashboard/setQuestionToSend', this.id)
      this.$store.commit('editor-dashboard/setRoundToSend', 'second')
      this.$emit('expert-dialog-open')
    }
  }
}

</script>
