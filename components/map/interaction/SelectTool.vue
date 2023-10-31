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
    <vl-interaction-select
        ref="selectObject"
        :layers.sync="selectableLayers"
        :features.sync="selectedFeatures"
        @select="onSelect"
        @unselect="onUnselect"
        :condition="condition"
    >
        <template slot-scope="select">

            <slot name="style">
                <vl-style>
                    <vl-style-text
                        :text="pointStyle.text"
                        :font="pointStyle.font"
                    >
                    </vl-style-text>
                    <vl-style-stroke
                        :color="lineStyle.color"
                        :width="lineStyle.width"
                    >
                    </vl-style-stroke>
                    <vl-style-fill :color="fillStyle.color"></vl-style-fill>
                </vl-style>
            </slot>

            <slot
                name="overlay"
                :features="select.features"
            >
                <vl-overlay
                    v-for="feature in select.features"
                    :key="feature.id"
                    :id="feature.id"
                    class="feature-popup"
                    :position="$findPointOnSurface(feature.geometry)"
                    :auto-pan="true"
                    :auto-pan-animation="{ duration: 300 }">
                    <template slot-scope="
                    // eslint-disable-next-line vue/no-unused-vars
                    popup">
                        <v-card
                                class="mx-auto"
                                max-width="344"
                        >
                            <v-card-text>
                                <div>Feature ID</div>
                                <p class="display-1 text--primary">
                                    {{ feature.id }}
                                </p>
                                <div class="text--primary">
                                    <p>
                                        Overlay popup content for Feature with ID <strong>{{ feature.id }}</strong>
                                    </p>
                                    <p>
                                        <v-simple-table
                                            dense
                                            fixedHeader
                                        >
                                            <template v-slot:default>
                                                <thead>
                                                <tr>
                                                    <th class="text-left">
                                                      Key
                                                    </th>
                                                    <th class="text-left">
                                                      Property
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr
                                                    v-for="(property, key) in feature.properties"
                                                    :key="key"
                                                >
                                                    <td>{{ key }}</td>
                                                    <td>{{ property }}</td>
                                                </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </p>
                                </div>
                            </v-card-text>
                            <!--<v-card-action>
                                <v-btn
                                        color="deep-purple lighten-2"
                                        text
                                        @click="updateLayer(getLayerIdFromFeature(feature))"
                                >
                                    Update Layer
                                </v-btn>
                            </v-card-action>-->
                        </v-card>
                    </template>
                </vl-overlay>
            </slot>
        </template>
    </vl-interaction-select>
</template>

<script>
import * as eventCondition from 'ol/events/condition'
import { mapGetters } from 'vuex'

export default {
  name: 'select-tool',
  props: ['map'],
  components: {
  },
  data: function () {
    return {
      pointStyle: {
        text: '\uf041',
        font: '60px FontAwesome',
        fill: {
          color: '#2355af'
        },
        stroke: {
          color: 'white'
        }
      },
      lineStyle: {
        color: '#d43f45',
        width: 2
      },
      fillStyle: {
        color: [254, 178, 76, 0.7]
      },
      selectByHover: false,
      selectRef: {},
      condition: eventCondition.singleClick
      // selectedFeatures: []
    }
  },
  computed: {
    ...mapGetters('layers', ['selectableLayers']),

    selectedFeatures: {
      get () { return this.$store.state.map.selectedFeatures },
      set (value) {
        this.setSelectedFeatures(value)
      }
    },

    olMap () {
      return this.map.$map
    }
  },
  methods: {
    selectCondition () {
      return this.selectByHover ? eventCondition.pointerMove : eventCondition.singleClick
    },
    setSelectedFeatures (features) {
      this.$store.commit('map/setSelectedFeatures', features)
      this.$emit('selectedFeatures', features)
    },
    updateLayer (layerId) {
      this.$nuxt.$emit('updateLayer', layerId)
    },
    onSelect (select) {
      this.$emit('select', select)
    },
    onUnselect (unselect) {
      // this.$emit('unselect', unselect)
    }
  },
  mounted () {
    this.selectRef = this.$refs.selectObject
  },
  created () {
    this.$nuxt.$on('selectFeatures', (id, key, value) => {
      this.selectRef.unselectAll()
      if (this.olMap !== undefined) {
        this.olMap.getLayers().forEach(layer => {
          if (layer.values_.id === id) {
            const source = layer.getSource()
            const features = source.getFeatures()
            features.forEach(feature => {
              if (Array.isArray(value)) {
                if (value.includes(feature.values_[key])) {
                  this.selectRef.select(feature)
                }
              } else if (feature.values_[key] === value) {
                this.selectRef.select(feature)
              }
            })
          }
        })
      }
    })
    this.$nuxt.$on('unselectAll', () => {
      this.selectRef.unselectAll()
    })
  }
}
</script>

<style>
    .feature-popup {
        position: absolute;
        left: -50px;
        bottom: 12px;
        width: 20em;
        max-width: none; }
    .feature-popup:after, .feature-popup:before {
        top: 100%;
        border: solid transparent;
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none; }
    .feature-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px; }
    .feature-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px; }
    .feature-popup .card-content {
        max-height: 20em;
        overflow: auto; }
    .feature-popup .content {
        word-break: break-all; }
</style>
