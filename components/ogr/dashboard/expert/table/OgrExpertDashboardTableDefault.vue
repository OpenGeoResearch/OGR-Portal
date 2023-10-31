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
  <v-data-table
    :style="style"
    :headers="headers"
    :items="items"
    sort-by="question.datastream.resultTime"
    :sort-desc="true"
    class="elevation-1 pt-3"
    item-key="question.datastream.id"
    single-expand
    show-expand
    :expanded.sync="expanded"
    no-data-text="Hier sind im Moment sind keine Fragen vorhanden."
  >
    <template v-slot:item.question.datastream.resultTime="{ item }">
      <ogr-editor-dashboard-table-item-date-time
        :datetime="item.question.datastream.resultTime"
      />
    </template>
    <template v-slot:item.question.datastream.images="{ item }">
      <ogr-editor-dashboard-table-item-image
        :images="item.question.datastream.images"
      />
    </template>
    <template v-slot:item.question.datastream.category="{ item }">
      <ogr-editor-dashboard-table-item-category
        :category="item.question.datastream.category"
      />
    </template>
    <template v-slot:item.observations="{ item }">
      <ogr-expert-dashboard-table-item-tags
        :tags="item.observations"
      />
    </template>
    <template v-slot:item.actions="{ item }">
      <template v-for="(action, i) in actions" >
        <component
          v-bind:key="i"
          :is="action"
          :id="item.question.datastream.id"
          @reject-dialog-open="$emit('reject-dialog-open')"
        />
      </template>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <v-slide-group
          show-arrows
        >
          <v-slide-item
            v-for="(image, j) in item.question.datastream.images"
            :key="j"
            class="mt-1 mb-1 mr-1"
          >
            <v-img
              :src="image + '?size=medium'"
              max-width="600"
            />
          </v-slide-item>
        </v-slide-group>
      </td>
    </template>
  </v-data-table>
</template>

<script>

import OgrEditorDashboardTableItemCategory from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemCategory'
import OgrEditorDashboardTableItemImage from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemImage'
import OgrEditorDashboardTableItemDateTime from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemDateTime'
import OgrExpertDashboardTableItemTags from '../item/OgrExpertDashboardTableItemTags'

export default {
  name: 'OgrExpertDashboardTableDefault',
  components: {
    OgrExpertDashboardTableItemTags,
    OgrEditorDashboardTableItemDateTime,
    OgrEditorDashboardTableItemImage,
    OgrEditorDashboardTableItemCategory
  },
  data () {
    return {
      expanded: [],
      headers: [
        { text: 'ID', value: 'question.datastream.id', sortable: true },
        { text: 'Erstellt', value: 'question.datastream.resultTime', sortable: true },
        { text: 'Vorschau', value: 'question.datastream.images', sortable: false },
        { text: 'Frage', value: 'question.datastream.name', sortable: false },
        { text: 'Beschreibung', value: 'question.datastream.description', sortable: false },
        { text: 'Kategorie', value: 'question.datastream.category', sortable: false },
        { text: 'Tags', value: 'observations', sortable: false },
        { text: 'Optionen', value: 'actions', sortable: false },
        { text: '', value: 'data-table-expand' }
      ],
      style: ''
    }
  },

  props: {
    items: {
      type: Array,
      required: true,
      default: () => { return [] }
    },
    actions: {
      type: Array,
      required: false,
      default: () => { return [] }
    }
  },

  beforeMount () {
    this.style = this.createStyle()
  },

  methods: {
    createStyle () {
      const width = '' + window.innerWidth - 20 + 'px'
      const padding = 'padding-right: 10px;'
      return 'width: ' + width + '; ' + padding
    }
  }
}

</script>
