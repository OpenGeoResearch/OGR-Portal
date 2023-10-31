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
  <div>
    <v-img
      v-if="images.length > 0"
      :width="imageWidth"
      :src="images[0] + '?size=medium'"
    ></v-img>
    <v-img
      v-else
      :width="imageWidth"
      src="/img/ogr_placeholder_3.png"
    ></v-img>
  </div>
</template>

<script>
export default {
  name: 'OgrEditorDashboardTableItemImage',
  data () {
    return {}
  },

  props: {
    images: {
      type: Array,
      required: true,
      default: () => { return [] }
    },
    imageWidth: {
      type: Number,
      required: false,
      default: 200
    }
  }
}

</script>
