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
    <v-dialog
      v-model="imageViewer"
      width="90vw"
    >
      <ogr-question-image-viewer :images="images" />
    </v-dialog>
  <v-carousel
    v-if="images.length > 0"
    :height="mediaHeight"
    show-arrows-on-hover
    progress
    hide-delimiters
    @click="test('Nothing')"
  >
    <v-carousel-item
      v-for="(image, i) in images"
      :key="image + i"
    >
      <v-img
        style="text-align: start; background-color: #ececec"
        :src="medium(image)"
        :lazy-src="placeholder"
        height="100%"
        @click="test('inPic')"
        contain
      >
        <v-btn
          v-if="false"
          icon
          dark
          color="error"
          @click="imageViewer = true"
        >
          <v-icon>
            mdi-fullscreen
          </v-icon>
        </v-btn>
      </v-img>
    </v-carousel-item>
  </v-carousel>
  <v-carousel
    v-else
    :height="mediaHeight"
    show-arrows-on-hover
    progress
    hide-delimiters
  >
    <v-carousel-item>
      <v-img
        style="text-align: start; background-color: #ececec"
        :src="placeholder"
        height="100%"
        contain
      >
      </v-img>
    </v-carousel-item>
  </v-carousel>
  </div>
</template>

<script>
import OgrQuestionImageViewer from '@/components/ogr/comments/OgrQuestionImageViewer'

export default {
  name: 'OgrForumQuestionImages',
  components: { OgrQuestionImageViewer },
  props: {
    images: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },

  data () {
    return {
      placeholder: '/img/ogr_placeholder_2.png',
      imageViewer: false
    }
  },

  computed: {
    mediaHeight () {
      if (this.$vuetify.breakpoint.xs || this.isMobile()) {
        return '200'
      } else {
        return '300'
      }
    }
  },

  mounted () {
    console.log(this.images)
  },
  methods: {
    test (test) {
      console.log(test)
      this.imageViewer = true
    },
    medium (url) {
      return url + '?size=medium'
    },
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}
</script>
