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
  <span>{{ datetime | dateParse('YYYY-MM-DD HH:mm') | dateFormat('DD. MMMM YYYY - HH:mm') }}</span>
</template>

<script>

export default {
  name: 'OgrEditorDashboardTableItemDateTime',
  data () {
    return {}
  },

  props: {
    datetime: {
      name: {
        type: String,
        required: true,
        default: '1970-01-01T00:00:00Z'
      }
    }
  }
}

</script>
