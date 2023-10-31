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
  <v-dialog
    :value="show"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title>Antwort an Editor:Innen senden</v-card-title>
      <v-form v-model="isFormValid">
        <v-card-text>
          <v-textarea
            v-model="comment"
            outlined
            label="Antwort an Editor:Innen"
            :rules="[rules.length(250)]"
            counter="250"
            placeholder=""
            rows="4"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="close"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!isFormValid"
            @click="confirm"
          >
            Antwort senden
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'OgrExpertDashboardDialogReject',
  data () {
    return {
      isFormValid: false,
      comment: '',
      rules: {
        required: (value) => {
          return !!value || this.$t('auth_rule_mandatory')
        },
        length: len => v => (v || '').length <= len || this.$t('input_text_length', [len])
      }
    }
  },

  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  methods: {
    close () {
      this.$emit('reject-dialog-close')
    },
    confirm () {
      this.$store.commit('editor-dashboard/setRejectComment', this.comment)
      this.$emit('reject-dialog-send')
    }
  }
}

</script>
