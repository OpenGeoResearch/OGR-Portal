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
            icon="mdi-lock-question"
            color="secondary"
            width="100%"
          >
            <span class="text-h4">{{ $t('auth_forgot_pw_banner') }}</span>
          </v-banner>
        </v-row>
        <v-row>
          <ogr-forgot-password-form-request
            v-if="requested === false"
            @token-request-success="requested = true"
          />
          <ogr-forgot-password-info-requested
            v-if="requested === true"
          />
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import OgrForgotPasswordFormRequest from '@/components/auth/forgotpw/ForgotPasswordFormRequest'
import OgrForgotPasswordInfoRequested from '@/components/auth/forgotpw/ForgotPasswordInfoRequested'

export default {
  components: { OgrForgotPasswordInfoRequested, OgrForgotPasswordFormRequest },
  layout: 'fullscreen',

  data () {
    return {
      requested: false
    }
  },

  methods: {
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}

</script>

<style scoped>

</style>
