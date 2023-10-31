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
  <v-card>
    <v-btn
        fab
        absolute
        icon
        right
        color="warning"
        @click="$emit('click-close-dialog')"
    >
      <v-icon large>mdi-close-box</v-icon>
    </v-btn>
    <v-card-title>{{$t('user_signup')}}</v-card-title>
    <v-card-text class="pt-4">
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'OgrSignUpCard',

  data () {
    return {
    }
  }
}

</script>

<style scoped>

</style>
