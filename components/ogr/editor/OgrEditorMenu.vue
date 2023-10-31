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
    <!--    Renders NonAdminMenu-->
    <template v-if="!this.$auth.user.roles.includes('ROLE_ADMIN')">
      <template v-for="(item, index) in items">
        <div class="divider" v-if="item.type === 'divider'" :key="index" />
        <ogr-editor-menu-item v-else :key="index" v-bind="item" />
      </template>
    </template>
    <!--    Renders AdminMenu-->
    <template v-if="this.$auth.user.roles.includes('ROLE_ADMIN')">
      <template v-for="(item, index) in adminItems">
        <div class="divider" v-if="item.type === 'divider'" :key="index" />
        <ogr-editor-menu-item v-else :key="index" v-bind="item" />
      </template>
    </template>
  </div>
</template>

<script>

import OgrEditorMenuItem from '@/components/ogr/editor/OgrEditorMenuItem'
export default {
  name: 'OgrEditorMenu',

  components: {
    OgrEditorMenuItem

  },

  props: {
    editor: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      adminItems: [
        {
          icon: 'bold',
          title: 'Bold',
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive('bold')
        },
        {
          icon: 'italic',
          title: 'Italic',
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.isActive('italic')
        },
        {
          icon: 'strikethrough',
          title: 'Strike',
          action: () => this.editor.chain().focus().toggleStrike().run(),
          isActive: () => this.editor.isActive('strike')
        }
      ],
      items: [
        {
          icon: 'bold',
          title: 'Bold',
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive('bold')
        },

        {
          icon: 'italic',
          title: 'Italic',
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.isActive('italic')
        },
        {
          icon: 'strikethrough',
          title: 'Strike',
          action: () => this.editor.chain().focus().toggleStrike().run(),
          isActive: () => this.editor.isActive('strike')
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.divider {
  width: 2px;
  height: 1.25rem;
  background-color: #A0E454;
  margin-left: 0.5rem;
  margin-right: 0.75rem;
}
</style>
