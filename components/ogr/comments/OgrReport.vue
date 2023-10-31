<template>
  <v-card v-if="!this.success">
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
      <v-card-title>{{$t('ogr_report_title')}}</v-card-title>
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
      <v-combobox
        class="px-2"
        v-model="selectedReason"
        :label="$t('ogr_report_choose_category')"
        :items="reportReasons"
        :rules="Rules"
        outlined
      >
      </v-combobox>
      <v-textarea
        v-model="report.text"
        :label="$t('ogr_report_describe_behaviour')"
        class="pa-2"
        outlined
      >
      </v-textarea>
      <v-btn
        color="secondary"
        class="mx-2 mb-2 mt-n4"
        :disabled="!isFormValid"
        @click="sendReport"
      >
        {{$t('ogr_report_submit')}}
      </v-btn>
    </v-form>
  </v-card>
  <v-card v-else>
    <v-card v-if="success" v-click-outside="closeDialog">
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
        {{ $t('ogr_report_success') }}
      </v-card-title>
      <v-card-text>
        {{ $t('ogr_report_success_text') }}
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
  name: 'OgrReportTool',
  props: {
    type: String,
    id: Number
  },
  data () {
    return {
      reportReasons: [
        this.$t('hatespeech'),
        this.$t('inappropriate_content')
      ],
      message: '',
      detailsText: '',
      isFormValid: false,
      success: false,
      alert: false,
      selectedReason: '',
      Rules: [
        v => !!v || this.$t('ogr_report_choose_category')
      ],
      report: {
        reason: '',
        text: ''
      }
    }
  },
  watch: {
    selectedReason () {
      if (this.selectedReason == this.$t('hatespeech')){
        this.report.reason = 1
      } else if (this.selectedReason==this.$t('inappropriate_content')){
        this.report.reason = 2
      }
    }
  },
  methods: {
    lowerFirstLetter(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    },
    async sendReport () {
      this.$axios.post('/ogr/report/' + this.lowerFirstLetter(this.type),
        {
          reason: this.report.reason,
          text: this.report.text,
          id: this.id,
          username: this.$auth.user.username
        })
        .then((response) => {
          if (response.status === 200) {
            this.success = true
          }
        })
        .catch((error) => {
          this.showAlert(this.$t('alert_error_occurred'))
        })
    },
    closeDialog () {
      this.selectedAction = ''
      this.detailsText = ''
      this.showAlert = false
      this.$emit('closeDialog')
    },
    showAlert (message) {
      this.message = message
      this.loading = false
      this.alert = true
    }
  }
}
</script>

<style scoped>

</style>
