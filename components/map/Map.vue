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
        <vl-map
            ref="mapObject"
            :load-tiles-while-animating="true"
            :load-tiles-while-interacting="true"
            :data-projection="'EPSG:' + EPSG"
            :style="{'height': height}"
        >
        <vl-view
            :zoom="zoom"
            :center="center"
            :rotation="rotation"
        >
        </vl-view>

        <select-tool
            v-if="this.selectable"
            :map="mapRef"
            @updateLayer="reloadLayer($event)"
            @selectedFeatures="$emit('selectedFeatures', $event)"
            @select="$emit('select', $event)"
            @unselect="$emit('unselect', $event)"
        >
            <template v-slot:style>
                <slot name="style"/>
            </template>
            <template v-slot:overlay="select">
                <slot
                    name="overlay"
                    :features="select.features"
                />
            </template>
        </select-tool>

        <!-- Add base layers -->
        <vl-layer-tile
            v-for="layer in baseLayers.layers"
            :key="layer.name"
            :id="layer.name"
            :visible="(baseLayers.active === layer.id) && baseLayers.visible"
            :opacity="baseLayers.opacity"
        >
            <component
                :is="'vl-source-' + layer.id"
                v-bind="layer"
            />
        </vl-layer-tile>

        <!-- Add overlay layers -->
        <component
            :is="layer.cmp"
            v-for="layer in layers"
            :key="layer.id"
            v-bind="layer"
            :visible="layer.visible"
            :z-index="layer.zIndex"
            :opacity="layer.opacity"
        >
            <template v-if="layer.cmp === 'vl-layer-group'">
                <component
                    :is="ingroup_layer.cmp"
                    v-for="ingroup_layer in layer.layers"
                    :key="ingroup_layer.id"
                    :z-index="ingroup_layer.zIndex"
                    v-bind="ingroup_layer"
                    :visible="ingroup_layer.visible"
                    :opacity="layer.opacity"
                >
                    <!-- add vl-source-* -->
                    <component
                        :is="ingroup_layer.source.cmp"
                        v-bind="ingroup_layer.source"
                    >
                    </component>
                </component>
            </template>

            <template v-else>
                <!-- add vl-source-* -->
                <template v-if="layer.source.cmp === 'vl-source-cluster'" >
                    <component
                        :is="layer.source.cmp"
                        v-bind="layer.source"
                    >
                        <component
                            :is="layer.source.source.cmp"
                            v-bind="layer.source.source"
                        >
                        </component>
                    </component>
                </template>

                <template v-else-if="layer.source.type === 'wfs' || layer.source.type === 'sta'">
                    <component
                        :is="layer.source.cmp"
                        :url="layer.source.url"
                        v-bind="layer.source"
                        :loading-strategy="layer.source.loadingStrategyFactory"
                    >
                    </component>
                </template>
                <template v-else-if="layer.source.type === 'geomqtt' || layer.source.type === 'mqtt'">
                    <component
                        :is="layer.source.cmp"
                        v-bind="layer.source"
                        :loaderFactory="layer.source.loaderFactory"
                        :loading-strategy="layer.source.loadingStrategyFactory"
                    >
                    </component>
                </template>
                <template v-else>
                    <component
                        :is="layer.source.cmp"
                        v-bind="layer.source"
                    >
                    </component>
                </template>
              <template v-if="layer.style">
                <component
                    :is="style.cmp"
                    v-for="(style, i) in layer.style"
                    :key="i"
                    v-bind="style"
                >
                    <!-- create inner style components: vl-style-circle, vl-style-icon, vl-style-fill, vl-style-stroke & etc -->
                  <template v-if="style.styles">
                    <component
                        :is="cmp"
                        v-for="(st, cmp) in style.styles"
                        :key="cmp"
                        v-bind="st"
                      >
                    </component>
                  </template>
                </component>
              </template>
            </template>
        </component>
    </vl-map>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import SelectTool from './interaction/SelectTool'
import { fromLonLat, transformExtent } from 'ol/proj'
import { Point } from 'ol/geom'

export default {
  components: {
    Vue,
    SelectTool
  },
  props: {
    height: {
      type: String,
      default: '100%'
    },
    // eslint-disable-next-line vue/require-prop-type-constructor
    selectable: true
  },
  data: function () {
    return {
      clickCoordinate: undefined,
      mapRef: {}
    }
  },
  computed: {
    ...mapState('layers', ['baseLayers', 'layers']),
    ...mapState('map', ['rotation', 'EPSG', 'zoom', 'center'])
  },
  mounted () {
    this.mapRef = this.$refs.mapObject
    this.mapRef.$once('rendercomplete', evt => {
      this.$nuxt.$emit('mapinitcomplete')
    })
  },
  created () {
    this.$nuxt.$on('updateLayer', (layerId, zoomToExtent) => {
      this.reloadLayer(layerId, zoomToExtent)
    })
    this.$nuxt.$on('reloadMapCanvas', () => {
      this.reloadMapCanvas()
    })
    this.$nuxt.$on('centerMap', (center) => {
      this.setMapCenter(center)
    })
    this.$nuxt.$on('zoomToCoordinates', (coordinates) => {
      this.zoomToCoordinates(coordinates)
    })
    this.$nuxt.$on('zoomToExtent', (extent) => {
      this.zoomToExtent(extent)
    })
    this.$nuxt.$on('zoomToGeometry', (geometry) => {
      this.zoomToGeometry(geometry)
    })
    this.$nuxt.$on('zoomToLayer', (layerId) => {
      this.zoomToLayer(layerId)
    })
    this.$nuxt.$on('setLayerVisibility', (layerId, visible) => {
      this.setLayerVisibility(layerId, visible)
    })
    this.$nuxt.$on('setLayerOpacity', (layerId, opacity) => {
      this.setLayerOpacity(layerId, opacity)
    })
  },
  methods: {
    setMapZoom (zoom) {
      this.$store.commit('map/setMapZoom', zoom)
    },
    setMapCenter (center) {
      this.$store.commit('map/setMapCenter', center)
    },
    setLayerVisibility (layerId, visible) {
      if (this.mapRef.$map !== undefined) {
        const layer = this.mapRef.$map.getLayers().getArray().find(item => item.values_.id === layerId)
        if (layer) {
          layer.setVisible(visible)
          this.$store.commit('ogr/setSeriesLayersVisible', visible)
        }
      }
    },
    setLayerOpacity (layerId, opacity) {
      if (this.mapRef.$map !== undefined) {
        const layer = this.mapRef.$map.getLayers().getArray().find(item => item.values_.id === layerId)
        if (layer) {
          layer.setOpacity(opacity)
        }
      }
    },
    reloadLayer (layerId, zoomToExtent) {
      if (this.mapRef.$map !== undefined) {
        const layer = this.mapRef.$map.getLayers().getArray().find(item => item.values_.id === layerId)
        if (layer !== undefined) {
          let source = layer.getSource()
          if (source.source !== undefined) {
            source = source.getSource()
          }
          if (zoomToExtent) {
            source.once('featuresloaded', () => {
              setTimeout(() => this.zoomToExtent(source.getExtent()), 500)
            })
          }
          source.refresh()
        }
      }
    },
    reloadMapCanvas () {
      if (this.mapRef.$map !== undefined) {
        this.mapRef.$map.updateSize()
      }
    },
    zoomToCoordinates (coordinates) {
      this.zoomToExtent(new Point(fromLonLat(coordinates)))
    },
    zoomToExtent (extent) {
      if (this.mapRef.$map !== undefined) {
        this.mapRef.$map.getView().fit(extent, { duration: 1000, padding: [50, 50, 50, 50], maxZoom: 17 })
      }
    },
    zoomToGeometry (geometry) {
      if (geometry.get('projection')) {
        this.zoomToExtent(transformExtent(geometry.getExtent(), geometry.get('projection'), this.mapRef.$map.getView().getProjection()))
      } else {
        this.zoomToExtent(geometry.getExtent())
      }
    },
    zoomToLayer (layerId) {
      if (this.mapRef.$map !== undefined) {
        const layer = this.mapRef.$map.getLayers().getArray().find(item => item.values_.id === layerId)
        if (layer !== undefined) {
          const source = layer.getSource()
          if (source.getState() === 'ready') {
            if (source.getFeatures().length > 0) {
              this.zoomToExtent(source.getExtent())
            }
          }
        }
      }
    }
  }
}
</script>

<style>

</style>
