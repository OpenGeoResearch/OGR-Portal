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
    :headers="headers"
    :items="items"
    sort-by="question.datastream.resultTime"
    :sort-desc="true"
    class="elevation-1"
    item-key="question.datastream.id"
    :items-per-page="5"
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
        :image-width="imageWidth"
      />
    </template>
    <template v-slot:item.question.datastream.category="{ item }">
      <ogr-editor-dashboard-table-item-category
        :category="item.question.datastream.category"
      />
    </template>
  </v-data-table>
</template>

<script>

import OgrEditorDashboardTableItemCategory from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemCategory'
import OgrEditorDashboardTableItemImage from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemImage'
import OgrEditorDashboardTableItemDateTime from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemDateTime'

export default {
  name: 'OgrEditorDashboardTableMini',
  components: {
    OgrEditorDashboardTableItemDateTime,
    OgrEditorDashboardTableItemImage,
    OgrEditorDashboardTableItemCategory
  },
  data () {
    return {
      headers: [
        { text: 'ID', value: 'question.datastream.id', sortable: true },
        { text: 'Erstellt', value: 'question.datastream.resultTime', sortable: true },
        { text: 'Vorschau', value: 'question.datastream.images', sortable: false },
        { text: 'Frage', value: 'question.datastream.name', sortable: false },
        { text: 'Kategorie', value: 'question.datastream.category', sortable: false }
      ]

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
    },
    imageWidth: {
      type: Number,
      required: false,
      default: 200
    }
  }
}

</script>
