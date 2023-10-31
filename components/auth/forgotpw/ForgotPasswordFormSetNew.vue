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
            tabindex="1"
            :label="$t('enter_new_user_password')"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            :rules="[rules.required, rules.password]"
            v-model="password1"
            @click:append="show = !show"
        />
        <v-text-field
            tabindex="2"
            :label="$t('repeat_new_user_password')"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            :rules="[rules.required, rules.confirm]"
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
              @click="setPassword"
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
  name: 'OgrForgotPasswordFormSetNew',

  props: {
    token: undefined
  },

  data () {
    return {
      isFormValid: false,
      loading: false,
      loader: null,
      show: false,
      rules: {
        required: (value) => { return !!value || this.$t('auth_rule_mandatory') },
        password: (value) => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,40}$/
          return pattern.test(value) || this.$t('auth_rule_password')
        },
        confirm: (value) => { return value === this.password1 || this.$t('auth_rule_repeat') }
      },
      alert: false,
      message: '',
      password1: '',
      password2: '',
      resetData: {
        token: undefined,
        password: ''
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

  mounted () {
    this.$watch(
      'password1',
      async () => {
        await this.$nextTick()
        this.$refs.form.validate()
      },
      { immediate: true }
    )
    this.$watch(
      'password2',
      async () => {
        await this.$nextTick()
        this.$refs.form.validate()
      },
      { immediate: true }
    )
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
    async setPassword () {
      this.loader = 'loading'
      this.resetData.password = this.password1
      this.resetData.token = this.token
      this.$axios.post('/ogr/auth/newpass',
        this.resetData)
        .then((response) => {
          if (response.status === 200) {
            this.loading = false
            this.$emit('set-password-success')
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
