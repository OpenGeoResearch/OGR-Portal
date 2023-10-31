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
  <v-card tile height="100%">
    <v-form
      ref="form"
      v-model="isFormValid"
    >
      <v-card-title>{{ $t('user_profile_edit_title') }}</v-card-title>
      <v-list class="transparent">
        <user-profile-info-item v-if="isExpert" :title="$t('user_profile_title_name') + ':'">
          <v-text-field
            v-model="input.name"
            :rules="[rules.chars, rules.len100]"
            outlined
            dense
            :label="$t('user_profile_edit_label_name')"
            counter="100"
          />
        </user-profile-info-item>

        <user-profile-info-item :title="$t('user_profile_title_description') + ':'">
          <v-textarea
            v-model="input.description"
            rows="5"
            :rules="[rules.chars, rules.len500]"
            :label="$t('user_profile_edit_label_description')"
            outlined
            counter="500"
          />
        </user-profile-info-item>

        <user-profile-info-item :title="isExpert ? $t('user_profile_title_fields_expert') + ':' : $t('user_profile_title_fields_user') + ':'">
          <treeselect
            class="mb-1"
            v-model="input.category1"
            :placeholder="$t('ogr_filter_select_category')"
            :multiple="false"
            :options="categories"
            search-nested
          />
          <treeselect
            class="mb-1"
            v-model="input.category2"
            :placeholder="$t('ogr_filter_select_category')"
            :multiple="false"
            :options="categories"
            search-nested
          />
          <treeselect
            v-model="input.category3"
            :placeholder="$t('ogr_filter_select_category')"
            :multiple="false"
            :options="categories"
            search-nested
          />
        </user-profile-info-item>

        <user-profile-info-item v-if="isExpert" :title="$t('user_profile_title_region') + ':'">
          <v-select
            v-model="input.region"
            :items="regions"
            item-text="name"
            return-object
            dense
            :label="$t('user_profile_edit_label_region')"
            outlined
          ></v-select>
        </user-profile-info-item>

        <user-profile-info-item v-if="isExpert" :title="$t('user_profile_title_affiliation') + ':'">
          <v-text-field
            v-model="input.affiliationName"
            :rules="[rules.chars, rules.len100]"
            outlined
            dense
            :label="$t('user_profile_edit_label_affiliation_name')"
            counter="100"
          />
          <v-text-field
            v-model="input.affiliationUrl"
            :rules="[rules.chars, rules.len500, rules.url]"
            outlined
            dense
            :label="$t('user_profile_edit_label_affiliation_url')"
            counter="500"
          />
        </user-profile-info-item>
      </v-list>
      <v-card-actions>
        <v-btn
          class="mt-2"
          :disabled="isFormValid === false"
          :loading="loading"
          color="secondary"
          @click="setUserData"
        >
          {{ $t('save_changes') }}
        </v-btn>
        <v-btn
          class="mt-2"
          @click="$emit('click-cancel')"
        >
          {{ $t('general_abort') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import UserProfileInfoItem from '@/components/ogr/user/UserProfileInfoItem'
// eslint-disable-next-line camelcase
import de_categories from 'static/de_categories.json'
// eslint-disable-next-line camelcase
import en_categories from 'static/en_categories.json'
import expertRegions from '@/apollo/queries/expertRegions'
import userData from '@/apollo/queries/userData'

export default {
  name: 'UserProfileEditInfo',
  components: { UserProfileInfoItem },
  props: {
    userData: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  computed: {
    categories: function () {
      if (this.$i18n.locale === 'de') {
        // eslint-disable-next-line camelcase
        return de_categories
      } else {
        // eslint-disable-next-line camelcase
        return en_categories
      }
    },
    isExpert: function () {
      return this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EXPERT')
    }
  },

  watch: {
    loader () {
      this.loading = true
      setTimeout(() => (this.timeout()), 3000)
      this.loader = null
    }
  },

  created () {
    this.getRegions()
  },

  mounted () {
    if (this.userData.userData) {
      this.input.name = this.userData.userData.name
      this.input.description = this.userData.userData.description
      this.input.category1 = this.userData.userData.field1
      this.input.category2 = this.userData.userData.field2
      this.input.category3 = this.userData.userData.field3
      this.input.region = this.userData.userData.expertRegion
      this.input.affiliationName = this.userData.userData.affiliationName
      this.input.affiliationUrl = this.userData.userData.affiliationUrl
    }
  },

  data () {
    return {
      rules: {
        len100: (value) => {
          return (value || '').length <= 100 || 'Es sind maximal 100 Zeichen erlaubt.'
        },
        len500: (value) => {
          return (value || '').length <= 500 || 'Es sind maximal 500 Zeichen erlaubt.'
        },
        chars: (value) => {
          const pattern = /^[a-zA-Z0-9ÄäÖöÜüß .,\-~_!?()%€°:;*+=#§$&'"[\]{}\\/]+$/
          if (value) {
            return pattern.test(value) || 'Dieses Zeichen ist nicht erlaubt.'
          } else {
            return true
          }
        },
        url: (value) => {
          const pattern = /((https:\/\/(www\.))|(https:\/\/)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
          if (value) {
            return pattern.test(value) || 'Keine gültige URL.'
          } else {
            return true
          }
        }
      },
      isFormValid: false,
      input: {
        name: undefined,
        description: undefined,
        category1: undefined,
        category2: undefined,
        category3: undefined,
        region: undefined,
        affiliationName: undefined,
        affiliationUrl: undefined
      },
      loading: false,
      loader: null,
      regions: []
    }
  },

  methods: {
    getRegions () {
      this.$apollo.query({
        query: expertRegions,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        if (response.data.getRegions) {
          this.regions = response.data.getRegions
        }
      })
    },
    setUserData () {
      let regionId = null
      if (this.input.region) {
        regionId = this.input.region.id
      }

      this.$apollo.query({
        query: userData,
        fetchPolicy: 'no-cache',
        variables: {
          username: this.$auth.user.username,
          name: this.input.name,
          affiliationName: this.input.affiliationName,
          affiliationUrl: this.input.affiliationUrl,
          description: this.input.description,
          field1: this.input.category1,
          field2: this.input.category2,
          field3: this.input.category3,
          regionId: regionId
        },
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        if (response.data.setUserData) {
          this.$emit('updated-user-data')
        }
      })
    }
  }

}

</script>

<style scoped>

::v-deep .vue-treeselect__control {
  border: 1px solid #9e9e9e;
}
::v-deep .vue-treeselect:not(.vue-treeselect--disabled):not(.vue-treeselect--focused) :hover  {
  border-color: #000000;
}
</style>
