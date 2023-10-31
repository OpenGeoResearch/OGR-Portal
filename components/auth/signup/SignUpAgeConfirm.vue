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
    <v-card-title style="word-break: break-word;">{{ $t('age_confirm_banner') }}</v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          class="text-subtitle-2"
          x-large
          color="secondary"
          @click="$emit('click-age-not-under-sixteen')"
      >
        {{ $t('age_confirm_text_older') }} <br> {{ $t('age_confirm_text_sixteen') }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
          class="text-subtitle-2"
          x-large
          color="secondary"
          @click="$emit('click-age-under-sixteen')"
      >
        {{ $t('age_confirm_text_younger') }} <br> {{ $t('age_confirm_text_sixteen') }}
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'OgrSignUpAgeConfirm',

  data () {
    return {
    }
  }
}

</script>

<style scoped>

</style>
