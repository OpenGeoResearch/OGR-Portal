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
    <v-card-title>
      {{ $t('age_info_title') }}
    </v-card-title>
    <v-card-text class="font-weight-medium subtitle-1">
      {{ $t('age_info_text') }}
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-btn
          color="primary"
          text
          to="/"
      >
        {{ $t('auth_signup_explore') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'OgrSignUpInfoAgeUnderSixteen',

  data () {
    return {
    }
  }
}

</script>

<style scoped>

</style>
