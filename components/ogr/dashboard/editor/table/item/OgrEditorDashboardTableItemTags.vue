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
    <v-chip
      class="mt-1"
      v-for="(tag, i) in tags"
      :key="tag + i"
      small
      outlined
      :color="functional.includes(tag.result) ? 'info' : 'primary'"
    >
      {{ tag.result }}
    </v-chip>
  </div>
</template>

<script>

export default {
  name: 'OgrEditorDashboardTableItemTags',
  data () {
    return {}
  },

  props: {
    tags: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },

  computed: {
    functional: {
      get: function () {
        return this.$store.state['editor-dashboard'].static.functional
      }
    }
  }
}

</script>
