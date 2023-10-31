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
  <v-card width="100%">
    <v-card-text>
      <v-form
        ref="form"
        v-model="isFormValid"
      >
        <v-alert
          :value="alert"
          outlined
          dense
          type="info"
          text
          transition="scale-transition"
        >
          {{ message }}
        </v-alert>
        <v-text-field
          tabindex="1"
          :label="$t('enter_user_username')"
          :rules="[rules.required, rules.username]"
          v-model="userData.username"
        />
        <v-text-field
          tabindex="2"
          :label="$t('enter_user_email')"
          :rules="[rules.required, rules.email]"
          v-model="userData.email"
        >
        </v-text-field>
        <v-layout justify-space-between>
          <v-btn
            class="mt-2"
            :disabled="!isFormValid"
            :loading="loading"
            color="secondary"
            @click="requestToken"
          >
            {{$t('dialog_signup_action')}}
          </v-btn>
          <v-btn
              class="mt-2"
              to="/"
          >
            {{$t('general_abort')}}
          </v-btn>
        </v-layout>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'OgrForgotPasswordFormRequest',

  data () {
    return {
      isFormValid: false,
      loading: false,
      loader: null,
      rules: {
        required: (value) => { return !!value || this.$t('auth_rule_mandatory') },
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || this.$t('auth_rule_mail')
        },
        username: (value) => {
          const pattern = /^[a-zA-Z0-9ÄäÖöÜü\\._-]{3,20}$/
          return pattern.test(value) || this.$t('auth_rule_username')
        }
      },
      alert: false,
      message: '',
      userData: {
        username: '',
        email: ''
      }
    }
  },

  watch: {
    loader () {
      this.loading = true
      setTimeout(() => (this.timeout()), 3000)
      this.loader = null
    }
  },

  methods: {
    timeout () {
      if (this.loading) {
        this.showAlert(this.$t('alert_network_error'))
      }
    },
    showAlert (message) {
      this.message = message
      this.loading = false
      this.alert = true
    },
    async requestToken () {
      this.loader = 'loading'
      this.$axios.post('/ogr/auth/forgot',
        this.userData)
        .then((response) => {
          if (response.status === 200) {
            this.loading = false
            this.$emit('token-request-success')
          }
        })
        .catch(() => {
          this.showAlert(this.$t('alert_error_occurred'))
        })
    }
  }
}

</script>

<style scoped>

</style>
