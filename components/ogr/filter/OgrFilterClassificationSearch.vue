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
    <v-card>
      <v-card-title>
          {{$t('ogr_categories')}}
      </v-card-title>

      <template v-if="tree">
        <treeselect
          v-model="selectedCategory"
          :placeholder="$t('ogr_filter_select_category')"
          :multiple="false"
          :options="categories" search-nested>
          <!--<label slot="option-label" slot-scope="{ node }">
              {{ node.id }}: {{ node.label }}
          </label>-->
        </treeselect>
      </template>

      <v-card-subtitle>
        {{$t('ogr_filter_top_categories')}}
        <v-switch
          v-model="hierarchical"
          :label="$t('ogr_filter_show_hierarchical_categories')"
        ></v-switch>
      </v-card-subtitle>
      <v-card-text>
        <div class="text--primary">
          <p>
            <v-simple-table
              dense
              fixedHeader
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      {{$t('ogr_category')}}</th>
                    <th class="text-left">
                      {{$t('amount_questions')}}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in topCategoriesWithName"
                    :key="item.code"
                    @click="selectCategory(item)"
                  >
                    <td>{{ item.name }}</td>
                    <td>{{ item.count }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable camelcase */

import de_categories from '@/static/de_categories.json'
import en_categories from '@/static/en_categories.json'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { topCategoriesList, calculateTopHierarchicalCategories } from '@/util/ogr-utils.js'

export default {
  name: 'OgrFilterClassificationSearch',

  components: {
    Treeselect
  },
  data: function () {
    return {
      tree: true,
      topCategories: [],
      hierarchical: false
    }
  },
  async fetch () {
    this.topCategories = await this.$axios.get('/ogr/topcategories')
      .then(res => res.data)
  },
  computed: {
    categories: function () {
      if (this.$i18n.locale === 'de') {
        return de_categories
      } else {
        return en_categories
      }
    },

    selectedCategory: {
      get: function () {
        return this.$store.state.ogr.category
      },
      set: function (value) {
        this.$store.commit('ogr/setCategory', value)
        /* eslint-disable */
        $nuxt.$emit('updateLayer', 'OGR')
        $nuxt.$emit('updateLayer', 'OGR_Cluster')
        /* eslint-enable */
      }
    },
    topCategoriesWithName: function () {
      if (this.hierarchical) {
        return calculateTopHierarchicalCategories(topCategoriesList(this.topCategories), this.$i18n.locale)
      } else {
        return topCategoriesList(this.topCategories, this.$i18n.locale)
      }
    }
  },
  methods: {
    selectCategory (item) {
      this.selectedCategory = item.code
    }
  }
}
</script>

<style scoped>
    .vue-treeselect__label {
        color:black;
    }
</style>
