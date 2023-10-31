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
    <v-card v-if="success">
      <v-card-title>{{$t('ogr_leave_feedback_success')}}</v-card-title>
      <v-card-text>{{$t('ogr_leave_feedback_success_text')}}</v-card-text>
      <v-btn
        @click="closeDrawer"
        class="mx-2 mb-2"
        color = "primary"
      >
        {{$t('continue')}}</v-btn>
    </v-card>
    <v-card v-if="!success" class="px-2 pb-2">
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
      <v-card-title>{{$t('ogr_leave_feedback_title')}}</v-card-title>
      <v-textarea
        v-model="feedback.text"
        outlined
        :label="$t('ogr_leave_feedback_title')"
      >
      </v-textarea>
      <v-btn
        :disabled="!feedback.text"
        @click="sendFeedback"
        color="primary"
      >
        {{$t('submit')}}
      </v-btn>
      <v-card-title>{{$t('ogr_retrieve_feedback_title')}}</v-card-title>
      <v-card v-for="feedback in retrievedFeedback" :key="retrievedFeedback.text" outlined class="mb-1">
        <v-card-text>
          {{feedback.origin}}: {{feedback.text}}
        </v-card-text>
      </v-card>
      <v-btn
        @click="getFeedback"
        color = "primary"
      >
        {{$t('retrieve')}}
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'OgrFeedback',
  data: function () {
    return {
      success: false,
      message: '',
      feedback: {
        text: '',
        username: this.$auth.user.username,
        origin: 'portal'
      },
      alert: false,
      retrievedFeedback: []
    }
  },
  methods: {
    async sendFeedback () {
      this.$axios.post('/ogr/feedback/',
        this.feedback)
        .then((response) => {
          if (response.status === 200) {
            this.success = true
          }
        })
        .catch(() => {
          this.showAlert(this.$t('alert_error_occurred'))
        })
    },
    async getFeedback () {
      this.$axios.get('/ogr/feedback/',
        { headers: { Authorization: this.$auth.getToken('local') } })
        .then((response) => {
          if (response.status === 200){
            this.retrievedFeedback = response.data
          }
        })
        .catch((error) => {
          this.showAlert(this.$t('alert_error_occurred'))
        })
    },
    closeDrawer () {
      this.feedback = ''
      this.success = false
      this.alert = false
      this.$emit('closeRightDrawer')
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
