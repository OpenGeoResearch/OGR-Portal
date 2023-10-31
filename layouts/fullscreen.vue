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
  <v-app dark>
    <Toolbar />
    <v-main>
      <v-container
        fluid
        fill-height
        style="align-items: start"
      >
        <nuxt />
      </v-container>
    </v-main>
    <ogr-footer />
  </v-app>
</template>

<script>
import Toolbar from '@/components/main/Toolbar'
import OgrFooter from '@/components/tools/OgrFooter'

export default {
  components: {
    OgrFooter,
    Toolbar
  },

  data: function () {
    return {
    }
  },

  methods: {
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}

</script>

<style >

</style>
