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
    <Toolbar/>
    <v-main>
      <InfoBanner />
      <div :class="{ shrinkedMap: detailsDrawer }">
        <Map
          :height="calcHeight()"
          :selectable=true
          @selectedFeatures="onFeaturesSelected($event)"
          @select="onSelect($event)"
        >
          <template v-slot:style>
            <vl-style>
              <vl-style-icon
                src="/img/markerSelect.png"
                color="#FFFFFF"
                :scale="0.6"
                :anchor="[0.5, 1]"
              >
              </vl-style-icon>
            </vl-style>
          </template>
          <template v-slot:overlay="select">
            <vl-overlay
              v-for="feature in select.features"
              :key="feature.id"
              :id="feature.id"
              :position="$findPointOnSurface(feature.geometry)"
            >
              <!--<ogr-no-overlay :feature="feature"></ogr-no-overlay>-->
            </vl-overlay>
          </template>
        </Map>
      </div>
        <v-navigation-drawer
          :value="detailsDrawer"
          :width="detailsDrawerWidth"
          absolute
          :permanent="detailsDrawer"
          hide-overlay
          :disable-resize-watcher="true"
          :disable-route-watcher="true"
        >
          <nuxt/>
          <v-btn
            class="mr-2"
            v-if="detailsDrawer"
            fab
            fixed
            right
            top
            @click="closeDetailsDrawer"
          >
            <v-icon dark>
              mdi-chevron-double-left
            </v-icon>
          </v-btn>
        </v-navigation-drawer>
    </v-main>
    <ogr-footer></ogr-footer>
  </v-app>
</template>

<script>

import Map from '@/components/map/Map'
import { mapState } from 'vuex'
import { createSTASource, createSTASeriesSource, createStyleFunc } from '@/util/ogr-utils'
import Toolbar from '../components/tools/Toolbar'
import { createEmpty, extend } from 'ol/extent'
import { Fill, Stroke } from 'ol/style'
import OgrFooter from '@/components/tools/OgrFooter'
import InfoBanner from '@/components/main/InfoBanner'

export default {
  components: {
    InfoBanner,
    OgrFooter,
    Map,
    Toolbar
  },
  data () {
    return {
      ogrHpUrl: this.$config.ogrHpUrl,
      ogrApiUrl: this.$config.ogrApiUrl,
      map: undefined,
      status: null,
      detailsDrawer: true,
      infoBannerHeight: 44
    }
  },

  computed: {
    ...mapState('map', ['rotation', 'EPSG', 'zoom', 'center', 'selectedFeatures']),
    path () {
      return this.$route.path
    },
    detailsDrawerWidth () {
      if (this.$vuetify.breakpoint.smAndDown || this.isMobile()) {
        return '100%'
      } else {
        return '40%'
      }
    }
  },

  watch: {
    path () {
      this.setDetailsDrawer(this.path)
    }
  },
  beforeMount () {
    this.setDetailsDrawer(this.$route.path)
  },

  created () {
    // init Map store
    if (this.zoom === undefined) {
      this.map = 'ogr'
      if (this.$route.query.map) this.map = this.$route.query.map
      const mapconfig = require('@/static/mapconfig/' + this.map + '.json')
      this.$store.commit('map/initStore', mapconfig)
      this.$store.commit('layers/initStore', mapconfig)
      this.$store.commit('layers/addLayer', {
        id: 'OGR_experts',
        title: 'OGR Experten',
        cmp: 'vl-layer-vector',
        visible: true,
        selectable: false,
        opacity: 1,
        source: {
          cmp: 'vl-source-vector',
          url: this.ogrApiUrl + '/ogr/expertRegions/'
        },
        style: [createStyleFunc(
          {
            cmp: 'vl-style-func',
            config: {
              fill: {
                color: '#00000012'
              },
              stroke: {
                color: '#219e46',
                width: 2
              },
              text: {
                ':text': 'label',
                font: 'bold italic 15px sans-serif',
                fill: new Fill({
                  color: '#219e46'
                }),
                stroke: new Stroke({
                  color: '#FFFFFF',
                  width: 2
                })
              }
            }
          })
        ]
      })
      this.$store.commit('layers/addLayer', {
        id: 'OGR',
        title: 'OpenGeoResearch',
        cmp: 'vl-layer-vector',
        visible: true,
        selectable: true,
        opacity: 1,
        maxResolution: 17,
        source: createSTASource({
          cmp: 'vl-source-vector',
          url: this.$config.ogrStaUrl + '/FROST-Server/v1.1/Datastreams'
        }),
        style: [
          {
            cmp: 'vl-style',
            styles: {
              'vl-style-icon': {
                src: '/img/marker_secondary.png',
                scale: 0.42,
                anchor: [0.5, 1]
              }
            }
          }
        ]
      })
      this.$store.commit('layers/addLayer', {
        id: 'OGR_Cluster',
        title: 'Cluster',
        cmp: 'vl-layer-vector',
        visible: true,
        selectable: true,
        minResolution: 17,
        source: {
          cmp: 'vl-source-cluster',
          distance: 100,
          source: createSTASource({
            cmp: 'vl-source-vector',
            url: this.$config.ogrStaUrl + '/FROST-Server/v1.1/Datastreams'
          })
        },
        style: [createStyleFunc({
          cmp: 'vl-style-func',
          config: {
            image: {
              icon: {
                src: '/img/marker_secondary_cluster.png',
                scale: 0.42,
                anchor: [
                  0.33,
                  1
                ]
              }
            },
            text: {
              ':text': '$size',
              font: 'bold 15px sans-serif',
              textAlign: 'center',
              textBaseline: 'middle',
              offsetX: '19',
              offsetY: '-53',
              fill: new Fill({
                color: 'white'
              }),
              stroke: new Stroke({
                color: 'black'
              })
            }
          }
        })
        ]
      })
      this.$store.commit('layers/addLayer', {
        id: 'OGR_Series',
        title: 'OpenGeoResearch Series',
        cmp: 'vl-layer-vector',
        visible: false,
        selectable: true,
        opacity: 1,
        maxResolution: 17,
        source: createSTASeriesSource({
          cmp: 'vl-source-vector',
          url: this.$config.ogrStaUrl + '/FROST-Server/v1.1/Datastreams'
        }),
        style: [
          {
            cmp: 'vl-style',
            styles: {
              'vl-style-icon': {
                src: '/img/marker_info.png',
                scale: 0.42,
                anchor: [0.5, 1]
              }
            }
          }
        ]
      })
      this.$store.commit('layers/addLayer', {
        id: 'OGR_Series_Cluster',
        title: 'OpenGeoResearch Series Cluster',
        cmp: 'vl-layer-vector',
        visible: false,
        selectable: true,
        minResolution: 17,
        source: {
          cmp: 'vl-source-cluster',
          distance: 100,
          source: createSTASeriesSource({
            cmp: 'vl-source-vector',
            url: this.$config.ogrStaUrl + '/FROST-Server/v1.1/Datastreams'
          })
        },
        style: [createStyleFunc({
          cmp: 'vl-style-func',
          config: {
            image: {
              icon: {
                src: '/img/marker_info_cluster.png',
                scale: 0.42,
                anchor: [
                  0.33,
                  1
                ]
              }
            },
            text: {
              ':text': '$size',
              font: 'bold 15px sans-serif',
              textAlign: 'center',
              textBaseline: 'middle',
              offsetX: '19',
              offsetY: '-53',
              fill: new Fill({
                color: 'white'
              }),
              stroke: new Stroke({
                color: 'black'
              })
            }
          }
        })
        ]
      })
    }

    if (this.$route.query.tags) {
      this.$store.commit('ogr/setTags', this.$route.query.tags.split(','))
    }
  },
  methods: {
    setDetailsDrawer (path) {
      if (path === '/') {
        this.closeDetailsDrawer()
      } else {
        this.detailsDrawer = true
      }
    },
    closeDetailsDrawer () {
      this.detailsDrawer = false
      this.$nuxt.$emit('unselectAll')
      this.$router.push('/')
    },
    onFeaturesSelected (features) {
      if (features.length === 0 && this.$route.path.startsWith('/question')) {
        this.$router.push('/')
      } else if (features.length > 0) {
        // features selected
        // check for cluster or individual feature
        if ('features' in features[0].properties) {
          // cluster
        } else {
          // individual
          this.$router.push('/question/' + features[0].properties.id)
        }
      }
    },
    onSelect (event) {
      if (event.feature.get('features') !== undefined) {
        // handle click on cluster
        const features = event.feature.get('features')
        const extent = createEmpty()
        features.forEach(function (feature) {
          extend(extent, feature.getGeometry().getExtent())
        })

        this.$nuxt.$emit('zoomToExtent', extent)
        this.$nuxt.$emit('unselectAll')
        this.$router.push('/')
      }
    },
    calcHeight () {
      if (this.isMobile()) {
        return '' + window.innerHeight - 124 - this.infoBannerHeight + 'px'
      } else {
        return '' + window.innerHeight - 94 - this.infoBannerHeight + 'px'
      }
    },
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}

</script>

<style >

  .shrinkedMap {
    margin-left: 40%
  }

  .sta-overlay {
    position: absolute;
    left: -50px;
    bottom: 12px;
    width: 40em;
    max-width: 800em;
  }

</style>
