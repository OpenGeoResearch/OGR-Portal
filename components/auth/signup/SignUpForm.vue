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
            autofocus
            :label="$t('enter_user_username')"
            :rules="[rules.required, rules.username]"
            v-model="signup.username"
        >
        </v-text-field>
        <v-text-field
            tabindex="2"
            :label="$t('enter_user_email')"
            :rules="[rules.required, rules.email]"
            v-model="signup.email"
        >
        </v-text-field>
        <v-text-field
            tabindex="3"
            :label="$t('enter_user_password')"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            :rules="[rules.required, rules.password]"
            v-model="password1"
            @click:append="show = !show"
        >
        </v-text-field>
        <v-text-field
            tabindex="4"
            :label="$t('repeat_user_password')"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            :rules="[rules.required, rules.confirm]"
            v-model="password2"
            @click:append="show = !show"
        >
        </v-text-field>
        <v-row no-gutters class="mt-2">
          <v-col cols="1">
            <v-checkbox
                v-model="signup.accepted"
                :rules="[rules.checkbox]"
                class="ma-0 pa-0"
            />
          </v-col>
          <v-col cols="11">
            <span>{{ $t('auth_terms_one') }} <a target="_blank" :href="ogrHpUrl + '/nutzungsbedingungen'"> {{ $t('auth_terms_use') }} </a> {{ $t('auth_terms_two') }} <a target="_blank" :href="ogrHpUrl + '/datenschutz'"> {{ $t('auth_terms_data') }} </a> {{ $t('auth_terms_three') }}</span>
          </v-col>
        </v-row>
        <v-layout justify-space-between>
          <v-btn
              class="mt-2"
              :disabled="!isFormValid"
              :loading="loading"
              color="secondary"
              @click="userSignUp"
          >
            {{$t('user_signup')}}
          </v-btn>
        </v-layout>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'OgrSignUpForm',

  data () {
    return {
      ogrHpUrl: this.$config.ogrHpUrl,
      success: false,
      signup: {
        username: '',
        email: '',
        password: '',
        accepted: false
      },
      agreed: false,
      isFormValid: false,
      loading: false,
      loader: null,
      show: false,
      password1: '',
      password2: '',
      rules: {
        required: (value) => { return !!value || this.$t('auth_rule_mandatory') },
        checkbox: (value) => { return !!value || false },
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || this.$t('auth_rule_mail')
        },
        password: (value) => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,40}$/
          return pattern.test(value) || this.$t('auth_rule_password')
        },
        username: (value) => {
          const pattern = /^[a-zA-Z0-9ÄäÖöÜü\\._-]{3,20}$/
          return pattern.test(value) || this.$t('auth_rule_username')
        },
        confirm: (value) => { return value === this.password1 || this.$t('auth_rule_repeat') }
      },
      alert: false,
      message: ''
    }
  },

  mounted () {
    this.$watch(
      'password1',
      async () => {
        await this.$nextTick()
        if (this.signup.username !== '' && this.signup.email !== '') {
          this.$refs.form.validate()
        }
      },
      { immediate: true }
    )
    this.$watch(
      'password2',
      async () => {
        await this.$nextTick()
        if (this.signup.username !== '' && this.signup.email !== '') {
          this.$refs.form.validate()
        }
      },
      { immediate: true }
    )
  },

  watch: {
    loader () {
      this.loading = true
      setTimeout(() => (this.timeout()), 10000)
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
    async userSignUp () {
      this.loader = 'loading'
      this.signup.password = this.password1
      this.$axios.post('/ogr/auth/signup',
        this.signup)
        .then((response) => {
          if (response.data.message === 'User registered successfully!') {
            this.loading = false
            this.$emit('sign-up-success')
          }
        })
        .catch((error) => {
          if (error.response.data.message === 'Error: Username is already taken!') {
            this.showAlert(this.$t('alert_username_taken'))
          } else {
            this.showAlert(this.$t('alert_failed_signup'))
          }
        })
    }
  }
}

</script>

<style scoped>

</style>
