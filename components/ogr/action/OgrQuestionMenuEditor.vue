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
    <ogr-dialog-editor :active="category">
      <ogr-category-input-editor
        :id="id"
        :classification="classification"
        @click-abort="category = false"
        @update-category="category = false"
        @update-functional-tags="$emit('update-functional-tags')"
      />
    </ogr-dialog-editor>

    <ogr-dialog-editor :active="addSemanticTags">
      <ogr-semantic-tags-input-editor
          :id="id"
          :semantic-tags="semanticTags"
          @click-abort="addSemanticTags = false"
          @update-semantic-tags="$emit('update-semantic-tags'); addSemanticTags = false"
          @update-functional-tags="$emit('update-functional-tags')"
      />
    </ogr-dialog-editor>

    <ogr-dialog-editor :active="editFunctionalTags">
      <ogr-functional-tags-input-editor
          :id="id"
          :functional-tags="functionalTags"
          @click-abort="editFunctionalTags = false"
          @update-functional-tags="$emit('update-functional-tags'); editFunctionalTags = false"
      />
    </ogr-dialog-editor>

    <v-menu
      v-model="menu"
      :close-on-content-click="true"
      offset-y
      bottom
      right
    >
      <template #activator="{ on, attrs }">
        <v-icon
          color="error"
          v-bind="attrs"
          v-on="on"
        >
          mdi-clipboard-edit
        </v-icon>
      </template>

      <v-list class="pa-0">
        <v-list-item
          dense
          @click="category = true"
        >
          <v-list-item-icon>
            <v-icon small>mdi-view-list</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('input_category_title') }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          dense
          @click="addSemanticTags = true"
        >
          <v-list-item-icon>
            <v-icon small>mdi-tag-text</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('input_semantic_tags_title') }}</v-list-item-title>
        </v-list-item>

        <v-list-item
            dense
            @click="editFunctionalTags = true"
        >
          <v-list-item-icon>
            <v-icon small>mdi-tag</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('input_functional_tags_title') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>

import OgrDialogEditor from '../dialog/OgrDialogEditor'
import OgrCategoryInputEditor from '../input/OgrCategoryInputEditor'
import OgrSemanticTagsInputEditor from '../input/OgrSemanticTagsInputEditor'
import OgrFunctionalTagsInputEditor from '../input/OgrFunctionalTagsInputEditor'
export default {
  name: 'OgrQuestionMenuEditor',
  components: { OgrFunctionalTagsInputEditor, OgrSemanticTagsInputEditor, OgrCategoryInputEditor, OgrDialogEditor },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    id: {
      required: true,
      default: null
    },
    classification: {
      type: String,
      required: true,
      default: null
    },
    semanticTags: {
      type: Array,
      required: true,
      default: () => { return [] }
    },
    functionalTags: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },

  data () {
    return {
      menu: false,
      category: false,
      addSemanticTags: false,
      editFunctionalTags: false
    }
  }
}
</script>
