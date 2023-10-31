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
    <v-row v-if="!isMobile()">
      <v-spacer></v-spacer>
    <v-col cols="auto">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            bottom
            color="grey darken-3"
            small
            v-bind="attrs"
            v-on="on"
            style="width: 30px;  min-width: 30px; height: 30px;"
            :href="`https://api.whatsapp.com/send?text=${$t('dialog_social_sharing_whatsapp')} ${url}`"
            target="_blank"
          >
            <v-icon>mdi-whatsapp</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('share') }} via Whatsapp</span>
      </v-tooltip>
    </v-col>

    <v-col cols="auto">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            bottom
            color="grey darken-3"
            v-bind="attrs"
            v-on="on"
            style="width: 30px;  min-width: 30px; height: 30px;"
            :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
            target="_blank"
          >
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('share') }} via Facebook</span>
      </v-tooltip>
    </v-col>

      <v-col cols="auto">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            bottom
            color="grey darken-3"
            small
            v-bind="attrs"
            v-on="on"
            style="width: 30px;  min-width: 30px; height: 30px;"
            :href="`https://twitter.com/intent/tweet?text=${$t('dialog_social_sharing_twitter')}${url}`"
            target="_blank"
          >
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('share') }} via Twitter</span>
      </v-tooltip>
      </v-col>

    <v-col cols="auto">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            bottom
            color="grey darken-3"
            small
            v-bind="attrs"
            v-on="on"
            :href="`mailto:?subject=OpenGeoResearch&amp;body=${$t('dialog_social_sharing_mail')} ${url}`"
            target="_blank"
            style="width: 30px;  min-width: 30px; height: 30px;"
          >
            <v-icon>mdi-email</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('share') }} via Mail</span>
      </v-tooltip>
    </v-col>
    <v-col cols="auto">

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            bottom
            color="grey darken-3"
            small
            v-bind="attrs"
            v-on="on"
            @click="copyLink()"
            target="_blank"
            style="width: 30px;  min-width: 30px; height: 30px;"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('copy_link') }}</span>
      </v-tooltip>
    </v-col>
    </v-row>

<!--  Mobile-->
    <v-speed-dial
      v-model="dialShare"
      absolute
      right
      bottom
      :direction="orientationOfButton"
      style="margin-right: 10px"
      v-if="isMobile()"
    >
      <template v-slot:activator>
        <v-btn fab bottom small color="primary" >
          <v-icon v-if="dialShare">mdi-close</v-icon>
          <v-icon v-else>mdi-share-variant</v-icon>
        </v-btn>
      </template>
      <v-btn
        dark
        bottom
        color="grey darken-3"
        small
        :href="`https://api.whatsapp.com/send?text=${$t('dialog_social_sharing_whatsapp')} ${url}`"
        target="_blank"
      >
        <v-icon>mdi-whatsapp</v-icon>
      </v-btn>
      <v-btn
        dark
        bottom
        color="grey darken-3"
        small
        :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
        target="_blank"
      >
        <v-icon>mdi-facebook</v-icon>
      </v-btn>
      <v-btn
        dark
        bottom
        color="grey darken-3"
        small
        :href="`https://twitter.com/intent/tweet?text=${$t('dialog_social_sharing_twitter')}${url}`"
        target="_blank"
      >
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-btn
        dark
        bottom
        color="grey darken-3"
        small
        :href="`mailto:?subject=OpenGeoResearch&amp;body=${$t('dialog_social_sharing_mail')} ${url}`"
        target="_blank"
      >
        <v-icon>mdi-email</v-icon>
      </v-btn>
      <v-btn
        dark
        bottom
        color="grey darken-3"
        small
        @click="copyLink()"
        target="_blank"
        style="padding: 2px"
      >
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-snackbar
      timeout="1500"
      v-model="snackbar"
      centered
      right
      max-width="300px"
      width="250px"
      min-width="150px"
      style="opacity: 0.7;"
    >
      <div style="text-align: center">
        {{ $t('link_copied') }}
      </div>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'OgrSocialSharing',
  data: function () {
    return {
      ogrMapUrl: this.$config.ogrMapUrl,
      snackbar: false
    }
  },
  computed: {
    url () {
      return (this.ogrMapUrl + this.$route.path)
    }
  },
  methods: {
    copyLink () {
      navigator.clipboard.writeText(this.url)
      this.snackbar = true
    },
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}
</script>

<style lang="css">
</style>
