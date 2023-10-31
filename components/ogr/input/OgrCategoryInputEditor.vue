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
  <v-card height="80vh">
    <v-card-title>{{ $t('input_category_title') }}</v-card-title>
    <v-card-text>
      <v-subheader class="pl-0 mt-0 mb-0 pb-0">
        {{ $t('input_category_subheader_current') }}
        <v-chip
          class="ml-1"
          color="info"
          label
          light
          x-small
        >
          {{ classification }}
        </v-chip>
      </v-subheader>
      <v-subheader class="pl-0 mt-0 pt-0">
        {{ $t('input_category_subheader_new') }}
        <v-chip
            class="ml-1"
            color="highlight"
            label
            light
            x-small
        >
          {{ category ? category.label : topCategory ? topCategory.label : '---' }}
        </v-chip>
      </v-subheader>

      <v-divider />

      <v-subheader class="pl-0 mt-2">
        {{ $t('input_category_common') }}
      </v-subheader>

      <v-select
          v-model="topCategory"
          :items="topCategories"
          :label="category ? $t('input_category_other_select') : $t('input_category_select')"
          item-text="label"
          item-value="id"
          outlined
          dense
          single-line
          return-object
          @input="selectTopCategory"
      />

      <v-subheader class="pl-0 mt-0">
        {{ $t('input_category_all') }}
      </v-subheader>

      <treeselect
        v-model="category"
        class="mb-1"
        :placeholder="$t('input_category_search')"
        :multiple="false"
        :options="categories"
        search-nested
        :clearable="false"
        always-open
        :default-expand-level="2"
        value-format="object"
        @input="selectCategory"
      />
    </v-card-text>
    <v-card-actions style="padding-top: 300px">
      <v-spacer />
      <v-btn
        @click="$emit('click-abort')"
      >
        {{ $t('general_abort') }}
      </v-btn>
      <v-btn
        color="secondary"
        @click="setCategory"
      >
        {{ $t('input_category_submit') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// eslint-disable-next-line camelcase
import de_categories_ogr from '@/static/de_categories_ogr.json'
// eslint-disable-next-line camelcase
import de_categories_top from '@/static/de_categories_top.json'
// eslint-disable-next-line camelcase
import en_categories_ogr from '@/static/en_categories_ogr.json'
// eslint-disable-next-line camelcase
import en_categories_top from '@/static/en_categories_top.json'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'OgrCategoryInputEditor',

  props: {
    id: {
      type: Number,
      required: true,
      default: null
    },
    classification: {
      type: String,
      required: true,
      default: null
    }
  },

  data () {
    return {
      ogrApiUrl: this.$config.ogrApiUrl,
      category: undefined,
      topCategory: undefined
    }
  },

  computed: {
    ...mapState('ogr', ['selectedQuestion']),

    categories () {
      if (this.$i18n.locale === 'de') {
        // eslint-disable-next-line camelcase
        return de_categories_ogr
      } else {
        // eslint-disable-next-line camelcase
        return en_categories_ogr
      }
    },
    topCategories () {
      if (this.$i18n.locale === 'de') {
        // eslint-disable-next-line camelcase
        return de_categories_top
      } else {
        // eslint-disable-next-line camelcase
        return en_categories_top
      }
    }
  },

  methods: {
    setCategory () {
      const config = this.createConfig('application/json')
      let category
      if (this.category) {
        category = this.category
      } else if (this.topCategory) {
        category = this.topCategory
      } else {
        return
      }
      const request = { datastreamId: this.id, category: category.id }

      axios.post(this.ogrApiUrl + '/ogr/question/setCategory', request, config)
        .then((response) => {
          if (response.status === 200) {
            this.setEdited()
            this.reloadData()
            this.$emit('update-category')
          }
        })
        .catch(() => {})
    },
    createConfig (type) {
      if (this.$auth.getToken('local')) {
        return { headers: { 'Content-Type': type, Authorization: this.$auth.getToken('local') } }
      } else {
        return { headers: { 'Content-Type': type } }
      }
    },
    selectCategory () {
      if (this.category) {
        this.topCategory = null
      }
    },
    selectTopCategory () {
      if (this.topCategory) {
        this.category = undefined
      }
    },
    reloadData () {
      axios.get(this.ogrApiUrl + '/FROST-Server/v1.1/Datastreams(' + this.id + ')')
        .then((response) => {
          if (response.status === 200) {
            this.$store.commit('ogr/setSelectedQuestion', response.data)
          }
        })
        .catch(() => {})
    },
    setEdited () {
      const config = this.createConfig('application/json')
      const request = { datastreamId: this.id, functionalTag: 'edited' }
      axios.post(this.ogrApiUrl + '/ogr/addFunctionalTag', request, config)
        .then((response) => {
          if (response.status === 200) {
            this.$emit('update-functional-tags')
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
::v-deep .vue-treeselect {
  position: relative;
  text-align: left;
  font-size: 16px;
  letter-spacing: normal;
}

/* #### Search container #### */
::v-deep .vue-treeselect__control {
  border: 2px solid #358706;
  border-bottom: 2px solid #e9e9e9;
}

/* Text Eingabe */
::v-deep .vue-treeselect--has-value .vue-treeselect__input {
  line-height: inherit;
  vertical-align: middle;
}
::v-deep .vue-treeselect__input {
  min-height: 40px;
}

/* Text Auswahl */
::v-deep .vue-treeselect__single-value {
  vertical-align: middle;
  font-size: 16px;
  padding-top: 2px;
}
/* Text Placeholder */
::v-deep .vue-treeselect__placeholder {
  color: rgba(0, 0, 0, 0.6);
  padding-top: 2px;
  font-size: 16px;
  font-weight: 100;
}

/* #### Select container #### */
::v-deep .vue-treeselect__menu {
  border-left: 2px solid #358706;
  border-right: 2px solid #358706;
  border-bottom: 2px solid #358706;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0 solid #e9e9e9;
}

/* aktives Element (Auswahl) */
::v-deep .vue-treeselect--single .vue-treeselect__option--selected {
  background: #e7f1df;
  font-weight: 500;
  color: #358706;
}
/* Listenelement (alle) */
::v-deep .vue-treeselect__indent-level-1 .vue-treeselect__option {
  padding-bottom: 3px;
  padding-top: 3px;
}

::v-deep .v-select__selections {
  text-transform: none;
}
</style>
