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
    <v-form v-model="isFormValid">
      <v-card-title>{{$t('ogr_ban_title')}}</v-card-title>
      <v-combobox
        class="px-2"
        v-model="selectedReason"
        :label="$t('ogr_ban_choose_reason')"
        :items="banReasons"
        :rules="Rules"
        outlined
      >
      </v-combobox>
      <v-textarea
        v-model="detailsText"
        :label="$t('ogr_report_describe_behaviour')"
        class="pa-2"
        outlined
      >
      </v-textarea>
      <v-btn
        color="secondary"
        class="mx-2 mb-2 mt-n4"
        :disabled="!isFormValid"
        @click="submit"
      >
        {{$t('ogr_ban_user')}}
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
        {{ $t('ogr_ban_success') }}
      </v-card-title>
      <v-card-text>
        {{ $t('ogr_ban_success_text') }}
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
  name: 'OgrBanUser',
  data () {
    return {
      banReasons: [
        'Hasskommentare',
        'Spam',
        'unsachgemäße Bilder'
      ],
      detailsText: '',
      isFormValid: false,
      showAlert: false,
      selectedReason: '',
      Rules: [
        v => !!v || this.$t('ogr_report_choose_category')
      ]
    }
  },
  methods: {
    submit () {
      this.showAlert = true
    },
    closeDialog () {
      this.selectedReason = ''
      this.detailsText = ''
      this.showAlert = false
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
