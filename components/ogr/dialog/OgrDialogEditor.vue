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
    :value="active"
    max-width="600"
    height="80vh"
    persistent
  >
    <v-container class="pa-0" height="80vh">
      <slot />
    </v-container>
  </v-dialog>
</template>

<script>

export default {
  name: 'OgrDialogEditor',
  data () {
    return {
    }
  },

  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    }
  }
}

</script>
