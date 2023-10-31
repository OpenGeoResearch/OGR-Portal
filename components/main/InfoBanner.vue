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
  <v-row no-gutters class="text-center">
    <v-menu
      v-if="width < 1750"
      :value="expand"
      min-width="100%"
      max-width="100%"
      rounded="0"
      bottom
      :close-on-click="false"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-card class="pa-0 ma-0" tile color="info" width="100%" :height="height">
          <v-list-item class="pa-0 ma-0">
            <v-list-item-content class="pa-0 ma-0">
              <v-list-item-subtitle class="pa-0 pl-2 ma-0 white--text text-subtitle-1">
                {{ $t('info_banner_project_ended_text') }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                class="pr-4"
                v-ripple="false"
                small
                plain
                color="white"
                v-bind="attrs"
                v-on="on"
                @click="expand = !expand"
              >
                {{ expand ? $t('info_banner_show_less') : $t('info_banner_show_more') }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </template>

      <v-card class="pa-0" tile color="info" elevation="0">
        <v-list-item class="pt-3 pl-2 pb-0 br-0 ma-0">
          <span class="white--text text-subtitle-1">{{ $t('info_banner_project_ended_text') }}</span>
          <v-spacer />
          <v-btn
            class="pr-0"
            style="align-self: start"
            v-ripple="false"
            small
            plain
            color="white"
            @click="expand = !expand"
          >
            {{ expand ? $t('info_banner_show_less') : $t('info_banner_show_more') }}
          </v-btn>
        </v-list-item>
      </v-card>
    </v-menu>
    <v-card v-else class="pa-0 ma-0" tile color="info" width="100%" :height="height">
      <v-list-item class="pa-0 ma-0">
        <v-list-item-content class="pa-0 ma-0">
          <v-list-item-subtitle class="pa-0 pl-2 ma-0 white--text text-subtitle-1">
            {{ $t('info_banner_project_ended_text') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-row>
</template>

<script>

export default {

  name: 'InfoBanner',

  props: {
    height: {
      type: Number,
      required: false,
      default: 44
    }
  },

  data () {
    return {
      ogrHpUrl: this.$config.ogrHpUrl,
      expand: false,
      width: 1150
    }
  },

  mounted () {
    this.width = window.innerWidth
  },

  methods: {
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}
</script>
