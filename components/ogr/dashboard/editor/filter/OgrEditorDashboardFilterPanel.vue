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
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header color="grey">
        <v-toolbar-title>Filter:</v-toolbar-title>
      </v-expansion-panel-header>
      <v-expansion-panel-content color="grey">
        <v-row no-gutters>
          <v-col cols="3">
            <ogr-editor-dashboard-filter-calendar class="mx-2" height="450px" />
          </v-col>
          <v-col cols="4">
            <ogr-editor-dashboard-filter-category class="mx-2" height="450px" />
          </v-col>
          <v-col cols="4">
            <ogr-editor-dashboard-filter-tags class="mx-2" height="450px" />
          </v-col>
        </v-row>
        <v-row class="mb-1 mt-2 mr-3">
          <v-spacer></v-spacer>
          <v-btn
              class="mr-2"
              @click="resetFilters"
          >
            Filter zurücksetzen
          </v-btn>
          <v-btn
              color="primary"
              @click="$emit('click-submit-filter')"
          >
            Filter anwenden
          </v-btn>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import OgrEditorDashboardFilterCalendar
  from '@/components/ogr/dashboard/editor/filter/OgrEditorDashboardFilterCalendar'
import OgrEditorDashboardFilterCategory
  from '@/components/ogr/dashboard/editor/filter/OgrEditorDashboardFilterCategory'
import OgrEditorDashboardFilterTags from '@/components/ogr/dashboard/editor/filter/OgrEditorDashboardFilterTags'

export default {
  name: 'OgrEditorDashboardFilterPanel',
  components: { OgrEditorDashboardFilterTags, OgrEditorDashboardFilterCategory, OgrEditorDashboardFilterCalendar },
  data () {
    return {}
  },
  methods: {
    resetFilters () {
      this.$store.commit('editor-dashboard/resetFilters')
    }
  }
}
</script>
