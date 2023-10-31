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
  <v-card v-if="!this.showAlert">
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
    <v-form v-model="isFormValid">
      <v-card-title>{{$t('ogr_add_role')}}</v-card-title>
      <v-combobox
        class="px-2"
        v-model="selectedRole"
        :label="$t('ogr_promote_choose_role')"
        :items="roles"
        :rules="Rules"
        outlined
      >
      </v-combobox>
      <v-btn
        color="secondary"
        class="mx-2 mb-2 mt-n4"
        :disabled="!isFormValid"
        @click="promote"
      >
        {{$t('confirm')}}
      </v-btn>
    </v-form>
  </v-card>
  <v-card v-else>
    <v-card v-if="showAlert" v-click-outside="closeDialog">
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
      <v-card-title class="headline">
        {{ $t('ogr_promote_success') }}
      </v-card-title>
      <v-card-text>
        {{ $t('ogr_promote_success_text') }}
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
  </v-card>
</template>

<script>
export default {
  name: 'OgrPromote',
  props: {
    user: ''
  },
  data () {
    return {
      roles: [
        this.$t('ogr_role_admin'),
        this.$t('ogr_role_moderator'),
        this.$t('ogr_role_scientist')
      ],
      isFormValid: false,
      showAlert: false,
      selectedRole: '',
      alert: false,
      Rules: [
        v => !!v || this.$t('ogr_promote_choose_role')
      ]
    }
  },
  computed: {
    addRole(){
      if (this.selectedRole === this.$t('ogr_role_admin')) {
        return ['ROLE_ADMIN']
      } else if (this.$t('ogr_role_moderator')) {
        return ['ROLE_MODERATOR']
      }
    },
  },
  methods: {
    submit () {
      this.showAlert = true
    },
    async promote () {
      this.$axios.post('/ogr/user/' + this.user + '/roles',
        this.addRole)
        .then((response) => {
          if (response.status === 200) {
            this.showAlert=true
          }
        })
        .catch((error) => {
          this.showAlert(this.$t('alert_error_occurred'))
        })
    },
    closeDialog () {
      this.selectedRole = ''
      this.showAlert = false
      this.$emit('closeDialog')
    },
    showAlert (message) {
      this.message = message
      this.loading = false
      this.alert = true
    },
  }
}
</script>

<style scoped>

</style>
