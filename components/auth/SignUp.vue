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
  <ogr-sign-up-card @click-close-dialog="closeDialog" v-click-outside="resetDialog">
    <ogr-sign-up-age-confirm
      v-if="!ageConfirmed"
      @click-age-under-sixteen="ageUnderSixteen = true; ageConfirmed = true"
      @click-age-not-under-sixteen="ageUnderSixteen = false; ageConfirmed = true"
    />

    <ogr-sign-up-info-age-under-sixteen
      v-if="ageConfirmed && ageUnderSixteen"
    ></ogr-sign-up-info-age-under-sixteen>

    <ogr-sign-up-form
      v-if="ageConfirmed && !ageUnderSixteen && !success"
      @sign-up-success="success = true"
    />

    <ogr-sign-up-info-success
        v-if="success"
        @click-close-dialog="closeDialog"
    ></ogr-sign-up-info-success>
  </ogr-sign-up-card>
</template>

<script>
import OgrSignUpCard from '@/components/auth/signup/SignUpCard'
import OgrSignUpForm from '@/components/auth/signup/SignUpForm'
import OgrSignUpAgeConfirm from '@/components/auth/signup/SignUpAgeConfirm'
import OgrSignUpInfoAgeUnderSixteen from '@/components/auth/signup/SignUpInfoAgeUnderSixteen'
import OgrSignUpInfoSuccess from '@/components/auth/signup/SignUpInfoSuccess'

export default {
  components: { OgrSignUpInfoSuccess, OgrSignUpInfoAgeUnderSixteen, OgrSignUpAgeConfirm, OgrSignUpForm, OgrSignUpCard },
  data () {
    return {
      success: false,
      ageConfirmed: false,
      ageUnderSixteen: true
    }
  },

  methods: {
    closeDialog () {
      this.$nuxt.$emit('signup-success')
    }
  }
}

</script>

<style scoped>

</style>
