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
  <v-card>
    <v-card-title>
      Zeit
    </v-card-title>
    <v-card-actions>
      <v-date-picker
        v-model="dates"
        range
        color="primary"
        header-color="secondary"
      ></v-date-picker>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'OgrEditorDashboardFilterCalendar',

  data: function () {
    return {
    }
  },
  computed: {
    dates: {
      get: function () {
        return this.$store.state['editor-dashboard'].filter.dates
      },
      set: function (value) {
        this.$store.commit('editor-dashboard/setDates', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
