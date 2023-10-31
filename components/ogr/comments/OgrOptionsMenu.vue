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
  <v-menu
    v-if="!showDialog"
    offset-y
    bottom
    right

  >
    <template v-slot:activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: onTooltip, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="{ ...onMenu, ...onTooltip }"
          >
            <v-icon v-if="iconSize !== 'small'">
              mdi-dots-vertical
            </v-icon>
            <v-icon
              small
              v-if="iconSize === 'small'"
            >
              mdi-dots-vertical
            </v-icon>
          </v-btn>
        </template>
        <span>{{$t('options')}}</span>
      </v-tooltip>
    </template>
    <v-list class="pa-0">
      <v-list-item
        dense
        @click="prepareTool({renderAs: 'dialog', cmp: 'ogr-report'})"
      >
        <v-list-item-icon>
          <v-icon small>mdi-alert-octagon</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('report')}}</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_ADMIN') && this.user"
        dense
        @click="prepareTool({renderAs: 'dialog', cmp: 'ogr-ban-user'})"
      >
        <v-list-item-icon>
          <v-icon small>mdi-account-cancel</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('ogr_ban_user')}}</v-list-item-title>
      </v-list-item>
      <v-list-item
          v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_ADMIN') && this.user"
          dense
          @click="prepareTool({renderAs: 'dialog', cmp: 'ogr-promote'})"
      >
        <v-list-item-icon>
          <v-icon small>mdi-account-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('ogr_add_role')}}</v-list-item-title>
      </v-list-item>
      <v-list-item
          v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_ADMIN') && this.user"
          dense
          @click="prepareTool({renderAs: 'dialog', cmp: 'ogr-demote'})"
      >
      <v-list-item-icon>
        <v-icon small>mdi-account-minus</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{$t('ogr_remove_role')}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-dialog
      v-else
      v-model="showDialog"
      hide-overlay
      max-width="600px"
  >
    <component :is="dialogComponent" :type="type" :id="id" :user="user" @closeDialog="closeDialog"></component>
  </v-dialog>
</template>

<script>
import OgrReport from '@/components/ogr/comments/OgrReport'
export default {
  name: 'OgrOptionsMenu',
  props: {
    iconSize: String,
    type: String,
    id: Number,
    user: ''
  },
  components: {
    OgrReport
  },
  data: function () {
    return {
      showDialog: false,
      dialogComponent: undefined,
    }
  },
  methods: {
    async report (report) {
      this.$axios.post('/ogr/report/' + this.type,
        {
          reason: report.reason,
          text: report.text,
          id: this.id,
          username: this.$auth.user.username
        })
        .then((response) => {
          if (response.status === 200) {
            this.success = true
          }
        })
        .catch((error) => {
          this.showAlert(this.$t('alert_error_occurred'))
        })
    },
    prepareTool (tool) {
      if (tool.renderAs === 'dialog') {
        this.showDialog = true
        this.dialogComponent = tool.cmp
      } else if (tool.renderAs === 'drawer') {
        this.$nuxt.$emit('unselectAll')
        this.$nextTick(() => {
          this.showRightDrawer = true
          this.rightDrawerComponent = tool.cmp
        })
      }
    },
    closeDialog () {
      this.showDialog = false
    },
    showBanDialog () {
      this.showBanDialog = true
    }
  }
}
</script>

<style scoped>

</style>
