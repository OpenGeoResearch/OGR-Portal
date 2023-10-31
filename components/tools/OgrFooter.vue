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
  <v-footer
    v-if="!isMobile()"
    height="30px"
    color="primary"
    app
  >
    <a class="white--text text-subtitle-2 font-weight-light mr-3 mb-1" target="_blank" :href="ogrHpUrl + '/nutzungsbedingungen'">{{ $t('footer_terms_of_use') }}</a>
    <a class="white--text text-subtitle-2 font-weight-light mr-3 mb-1" target="_blank" :href="ogrHpUrl + '/datenschutz'">{{ $t('footer_privacy_policy') }}</a>
    <a class="white--text text-subtitle-2 font-weight-light mr-3 mb-1" target="_blank" :href="ogrHpUrl + '/impressum'">{{ $t('footer_imprint') }}</a>
    <a class="white--text text-subtitle-2 font-weight-light mb-1" target="_blank" :href="ogrHpUrl">{{ $t('footer_home') }}</a>
  </v-footer>
  <v-footer
    v-else
    color="primary"
    height="60px"
    app
  >
    <a class="white--text text-subtitle-2 font-weight-light mr-3 mb-1" target="_blank" :href="ogrHpUrl + '/nutzungsbedingungen'">{{ $t('footer_terms_of_use') }}</a><br>
    <a class="white--text text-subtitle-2 font-weight-light mr-3 mb-1" target="_blank" :href="ogrHpUrl + '/datenschutz'">{{ $t('footer_privacy_policy') }}</a>
    <a class="white--text text-subtitle-2 font-weight-light mr-3 mb-1" target="_blank" :href="ogrHpUrl + '/impressum'">{{ $t('footer_imprint') }}</a>
    <a class="white--text text-subtitle-2 font-weight-light mb-1" target="_blank" :href="ogrHpUrl">{{ $t('footer_home') }}</a>
  </v-footer>
</template>

<script>

export default {
  name: 'OgrFooter',

  data: function () {
    return {
      ogrHpUrl: this.$config.ogrHpUrl
    }
  },

  methods: {
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}

</script>

<style >

</style>
