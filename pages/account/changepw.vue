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
  <v-container>
    <v-row>
      <v-spacer></v-spacer>
      <v-col :cols="isMobile() ? 12 : 6">
        <v-row>
          <v-banner
              dark
              class="mb-2"
              elevation="3"
              icon="mdi-key-change"
              color="secondary"
              width="100%"
          >
            <span class="text-h4">{{ $t('auth_change_pw_banner') }}</span>
          </v-banner>
        </v-row>
        <v-row>
          <ogr-change-password-info-success
            v-if="success"
          />

          <ogr-change-password-form
            v-else
            @change-password-success="onSuccess"
          />
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import OgrChangePasswordForm from '@/components/auth/changepw/ChangePasswordForm'
import OgrChangePasswordInfoSuccess from '@/components/auth/changepw/ChangePasswordInfoSuccess'

export default {
  components: { OgrChangePasswordInfoSuccess, OgrChangePasswordForm },
  layout: 'fullscreen',

  data () {
    return {
      success: false
    }
  },

  beforeCreate () {
    if (!this.$auth.loggedIn) {
      window.$nuxt.$router.replace('/')
    }
  },

  methods: {
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    onSuccess () {
      this.$auth.logout()
      this.success = true
    }
  }
}

</script>

<style scoped>

</style>
