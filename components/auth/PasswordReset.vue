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
  <v-card v-if="success">
    <v-card-title class="headline">
      {{ $t('dialog_reset_password_success') }}
    </v-card-title>

    <v-card-text>
      {{ $t('dialog_reset_password_text') }}
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        text
        @click="closeDialog"
      >
        {{ $t('dialog_signup_action') }}
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else-if="!currentToken">
    <v-btn
      fab
      absolute
      icon
      right
      color="red"
      @click="closeDialog"
    >
      <v-icon large>mdi-close-box</v-icon>
    </v-btn>
    <v-card-title>{{$t('reset_link')}}</v-card-title>
    <v-card-text>{{$t('dialog_reset_password_instruction_1')}}</v-card-text>
    <v-card-text class="pt-4">
      <div>
          <v-text-field
            :label="$t('enter_user_username')"
            v-model="userData.username"
          >
          </v-text-field>
          <v-text-field
            :label="$t('enter_user_email')"
            v-model="userData.email"
          >
          </v-text-field>
          <v-layout justify-space-between>
            <v-btn
              class="mt-2"
              :disabled="!userData.email"
              :loading="loading"
              color="secondary"
              @click="sendToken(); closeDialog();"
            >
              {{$t('dialog_signup_action')}}
            </v-btn>
          </v-layout>
      </div>
    </v-card-text>
  </v-card>
  <v-card v-else-if="currentToken">
    <v-btn
      fab
      absolute
      icon
      right
      color="red"
      @click="closeDialog"
    >
      <v-icon large>mdi-close-box</v-icon>
    </v-btn>
    <v-card-title>{{$t('reset_user_password')}}</v-card-title>
    <v-card-text>{{$t('dialog_reset_password_instruction_2')}}</v-card-text>
    <v-card-text class="pt-4">
      <div>
        <v-form
          ref="form"
          v-model="isFormValid">
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
            tabindex="3"
            :label="$t('enter_new_user_password')"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            :rules="[rules.required, rules.password]"
            v-model="resetData.password"
            @click:append="show = !show"
          />
          <v-text-field
            tabindex="4"
            :label="$t('repeat_new_user_password')"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            :rules="[rules.required, rules.repeat]"
            v-model="password2"
            @click:append="show = !show"
          >
          </v-text-field>
          <v-layout justify-space-between>
            <v-btn
              class="mt-2"
              :disabled="!isFormValid"
              :loading="loading"
              color="secondary"
              @click="safeChanges"
            >
              {{$t('safe_changes')}}
            </v-btn>
          </v-layout>
        </v-form>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    queryToken: String
  },
  data: function () {
    return {
      userData: {
        username: '',
        email: ''
      },
      resetData: {
        token: this.$route.query.token,
        password: ''
      },
      success: false,
      isFormValid: false,
      loading: false,
      loader: null,
      show: false,
      password2: '',
      resetCode: '',
      rules: {
        required: (value) => { return !!value || this.$t('auth_rule_mandatory') },
        password: (value) => {
          const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
          return pattern.test(value) || this.$t('auth_rule_password')
        },
        repeat: (value) => { return value === this.resetData.password || this.$t('auth_rule_repeat') }
      },
      alert: false,
      message: ''
    }
  },
  computed: {
    currentToken () {
      return this.$route.query.token
    }
  },
  watch: {
    loader () {
      this.loading = true
      setTimeout(() => (this.timeout()), 3000)
      this.loader = null
    },
    currentToken () {
      this.resetData.token = this.currentToken
    }

  },

  methods: {
    timeout () {
      if (this.loading) {
        this.showAlert(this.$t('alert_network_error'))
      }
    },
    closeDialog () {
      this.password2 = ''
      this.success = false
      this.email = ''
      this.resetData.token = ''
      this.$router.push('/')
      this.$emit('closeDialog')
    },
    showAlert (message) {
      this.message = message
      this.loading = false
      this.alert = true
    },
    async safeChanges () {
      this.$axios.post('/ogr/auth/newpass',
        this.resetData)
        .then((response) => {
          if (response.status === 200) {
            this.password2 = ''
            this.success = true
            this.email = ''
            this.resetData.token = ''
            this.$router.push('/')
          }
        })
        .catch((error) => {
          this.showAlert(this.$t('alert_error_occurred'))
        })
    },
    async sendToken () {
      this.$axios.post('/ogr/auth/forgot',
        this.userData)
        .then((response) => {
          if (response.status === 200) {
            this.emailVerified = true
          }
        })
        .catch((error) => {
          this.showAlert(this.$t('alert_error_occurred'))
        })
    }
  }
}

</script>

<style scoped>

</style>
