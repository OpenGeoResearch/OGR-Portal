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
  <v-card
      width="100%"
  >
    <v-card-title class="text-h4">
      <v-spacer></v-spacer>
      <span>Keine Fragen vorhanden!</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text class="text-h6 text-center">
      Im Moment sind hier keine weiteren Fragen vorhanden.
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'OgrExpertDashboardTableItemNoData',
  data () {
    return {}
  }
}

</script>
