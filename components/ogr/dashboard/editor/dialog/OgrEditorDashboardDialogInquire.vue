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
    @click:outside="$emit('expert-dialog-close')"
  >
    <v-card height="300">
      <v-card-title>Frage an Experten:Innen senden</v-card-title>

      <v-card-text>Du kannst diese Frage direkt an eine Expert:in senden. Wähle dazu den entsprechenden Account aus der unten stehenden Liste aus. </v-card-text>

      <v-card-text v-if="loader" align="center">
        <v-progress-circular
          class="mt-5"
          :size="75"
          :color="loading ? 'secondary' : 'neutral'"
          :indeterminate="loading"
        >
          <v-icon
            v-if="success === true"
            :size="70"
            color="primary"
          >
            mdi-check
          </v-icon>
        </v-progress-circular>
        <v-card-text v-if="success === true" align="center" class="mt-0 pt-0">
          Erfolgreich an {{ selected.username }} gesendet.
        </v-card-text>
      </v-card-text>

      <v-form v-if="!(loader === true || success === true)" v-model="isFormValid">
        <v-card-text>
          <v-combobox
            v-model="selected"
            :items="experts"
            :rules="[rules.required]"
            item-text="username"
            clearable
            outlined
            dense
            persistent-hint
            hint="Die Frage wird per E-Mail an die ausgewählte Expertengruppe geschickt."
          ></v-combobox>
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
            Frage senden
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'OgrEditorDashboardDialogInquire',
  data () {
    return {
      selected: undefined,
      isFormValid: false,
      rules: {
        required: (value) => {
          return !!value || this.$t('auth_rule_mandatory')
        }
      }
    }
  },

  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    experts: {
      type: Array,
      required: true,
      default: () => { return [] }
    },
    loader: {
      type: Boolean,
      required: true,
      default: false
    },
    success: {
      type: Boolean,
      required: true,
      default: false
    },
    loading: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  watch: {
    show () {
      this.selected = undefined
    }
  },

  methods: {
    close () {
      // this.selected = undefined
      this.$emit('expert-dialog-close')
    },
    confirm () {
      this.$store.commit('editor-dashboard/setExpertToSendTo', this.selected.id)
      // this.selected = undefined
      this.$emit('expert-dialog-send')
    }
  }
}

</script>
