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
    class="elevation-1 pt-3 pl-2 pr-2"
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
    <template v-slot:item.expertInquiry.created="{ item }">
      <ogr-editor-dashboard-table-item-date-time-inquiry
        :datetime="item.expertInquiry ? item.expertInquiry.created : '1970-01-01T00:00:00.000000'"
        :rejected="item.expertInquiry.rejected"
        :comment="item.expertInquiry.comment"
      />
    </template>
    <template v-slot:item.expertInquiry.user.username="{ item }">
      <ogr-editor-dashboard-table-item-expert
        :username="item.expertInquiry ? item.expertInquiry.user.username : 'no result'"
      />
    </template>
    <template v-slot:item.observations="{ item }">
      <ogr-editor-dashboard-table-item-tags
        :tags="item.observations"
      />
    </template>
    <template v-slot:item.actions="{ item }">
      <template v-for="(action, i) in actions" >
        <component
          v-bind:key="i"
          :is="action"
          :id="item.question.datastream.id"
          @expert-dialog-open="$emit('expert-dialog-open')"
          @click-action-interesting="$emit('click-action-interesting', $event)"
          @click-action-not-interesting="$emit('click-action-not-interesting', $event)"
          @click-action-review="$emit('click-action-review', $event)"
          @click-action-close="$emit('click-action-close', $event)"
          @click-action-re-open="$emit('click-action-re-open', $event)"
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
import OgrEditorDashboardTableItemTags from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemTags'
import OgrEditorDashboardTableItemImage from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemImage'
import OgrEditorDashboardTableItemDateTime from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemDateTime'
import OgrEditorDashboardTableItemExpert from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemExpert'
import OgrEditorDashboardTableItemDateTimeInquiry from '@/components/ogr/dashboard/editor/table/item/OgrEditorDashboardTableItemDateTimeInquiry'

export default {
  name: 'OgrEditorDashboardTableInquiry',
  components: {
    OgrEditorDashboardTableItemDateTimeInquiry,
    OgrEditorDashboardTableItemExpert,
    OgrEditorDashboardTableItemDateTime,
    OgrEditorDashboardTableItemImage,
    OgrEditorDashboardTableItemTags,
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
        { text: 'Angefragt', value: 'expertInquiry.created', sortable: false },
        { text: 'Expert:In', value: 'expertInquiry.user.username', sortable: false },
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
