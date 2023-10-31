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
    <v-app-bar
      class="include"
      color="primary"
      height="64px"
      app
      dark
    >
      <template
        v-if="!isMobile() && !$vuetify.breakpoint.xs"
      >
      <nuxt-link
        to="/"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-img
              class="ml-n1"
              :src="logo"
              max-height="40"
              max-width="160"
              contain
              v-on="on"
              v-bind="attrs"
            >
            </v-img>
          </template>
          <span>Home</span>
        </v-tooltip>
      </nuxt-link>
      </template>
      <v-tooltip
        v-if="isMobile() || $vuetify.breakpoint.xs"
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ml-n1"
            v-on="on"
            v-bind="attrs"
            icon
            to="/"
          >
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <template>
        <OgrFilterRegionSearch class="mr-6 mt-3" v-if="!isMobile() && !$vuetify.breakpoint.xs">
        </OgrFilterRegionSearch>
        <v-menu
          v-if="isMobile() || $vuetify.breakpoint.xs"
          offset-y
          :close-on-content-click="false"
          bottom
          right
          max-height="50"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-map-search-outline</v-icon>
            </v-btn>
          </template>
          <v-list
            color="white"
            class="pa-0"
            width="300"
          >
            <OgrFilterRegionSearch class="px-2"></OgrFilterRegionSearch>
          </v-list>
        </v-menu>
      </template>

      <template>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              to="/series"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-map-marker-multiple</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('forum_tooltip_question_series') }}</span>
        </v-tooltip>
        <v-menu
          offset-y
          open-on-hover
          bottom
          right
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-book-open-variant</v-icon>
            </v-btn>
          </template>
          <v-list>
            <div
              v-for="page in pages"
              :key="page.id"
            >
              <v-list-item
                v-if="page.active"
                @click="$router.push({ path: page.route})"
              >
                <v-list-item-title>{{ $t(page.title) }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                @click="prepareTool(ogrFilterTool)"
                v-bind="attrs"
                v-on="on"
            >
              <v-icon>{{ogrFilterTool.icon}}</v-icon>
            </v-btn>
          </template>
          <span>Filter</span>
        </v-tooltip>
      </template>

      <v-menu
          v-if="!this.$auth.loggedIn"
          :close-on-content-click="false"
          offset-y
          bottom
          right
      >
      <template v-slot:activator="{on: onMenu}">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: onTooltip, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="{ ...onMenu, ...onTooltip }"
            >
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <span>{{$t('user_profile')}}</span>
        </v-tooltip>
      </template>
        <v-card width="250px">
          <v-row align="center">
            <v-col cols="8">
              <v-card-title>Login</v-card-title>
            </v-col>
            <v-col cols="4">
              <v-select
                  v-model="selectedLocale"
                  :items="availableLocales"
                  item-text="code"
                  item-value="code"
                  style="max-width: 50px;"
                  dense
              >
              </v-select>
            </v-col>
          </v-row>
          <v-card-text class="pt-4">
            <div>
              <v-form ref="form">
                <v-alert
                    v-if="showAlert===true"
                    type="error"
                >
                  {{$t('error_invalid_username_password')}}
                </v-alert>
                <v-text-field
                    v-model="login.username"
                    :label="$t('enter_user_username')"
                    required
                    @keyup.enter="userLogin"
                >
                </v-text-field>
                <v-text-field
                    v-model="login.password"
                    :label="$t('enter_user_password')"
                    type="password"
                    min="8"
                    counter
                    required
                    @keyup.enter="userLogin"
                ></v-text-field>
                <v-row no-gutters>
                  <v-btn @click="userLogin">
                    {{$t('user_login')}}
                  </v-btn>
                </v-row>
                <v-row
                    class="text-left"
                    no-gutters
                >
                  <NuxtLink class="text-decoration-underline" to="/account/forgotpw">
                    {{$t('reset_user_password')}}
                  </NuxtLink>
                </v-row>

              </v-form>
            </div>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-layout justify-space-between>
              <v-btn to="/account/signup">
                {{$t('user_signup')}}
              </v-btn>
            </v-layout>
          </v-card-text>
          <loader></loader>
        </v-card>
      </v-menu>
      <v-menu
          v-if="this.$auth.loggedIn"
          :close-on-content-click="false"
          offset-y
          bottom
          right
      >
        <template v-slot:activator="{on: onMenu}">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: onTooltip, attrs }">
              <v-btn
                  icon
                  v-bind="attrs"
                  v-on="{ ...onMenu, ...onTooltip }"
              >
                <v-icon>mdi-account-circle</v-icon>
              </v-btn>
            </template>
            <span>{{$t('user_profile')}}</span>
          </v-tooltip>
        </template>

        <v-list
            width="250px"
            dense
        >
          <v-list-item
              :to="`/user/${this.$auth.user.username}`"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-box</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{$t('show_user_profile')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              to="/account/changepw"
          >
            <v-list-item-icon>
              <v-icon>mdi-lock-reset</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{$t('change_user_password')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              v-if="this.$auth.loggedIn && ( this.$auth.user.roles.includes('ROLE_ADMIN') || this.$auth.user.roles.includes('ROLE_EDITOR') )"
              @click="prepareTool(ogrFilterUserSearch)"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-search</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{$t('search_user')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
              v-if="this.$auth.loggedIn && (this.$auth.user.roles.includes('ROLE_EDITOR') || this.$auth.user.roles.includes('ROLE_TEACHER'))"
              to="/dashboard/series"
          >
            <v-list-item-icon>
              <v-icon>mdi-map-marker-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Serien-Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
              v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EXPERT')"
              to="/dashboard/expert"
          >
            <v-list-item-icon>
              <v-icon>mdi-school</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Experten-Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
              v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_MODERATOR')"
              to="/dashboard/moderator"
          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Moderations-Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
              v-if="this.$auth.loggedIn && this.$auth.user.roles.includes('ROLE_EDITOR')"
              to="/dashboard/editor"
          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard-edit-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Editor-Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
              v-if="this.$auth.loggedIn"
              @click="prepareTool(ogrFeedback)"
          >
            <v-list-item-icon>
              <v-icon>mdi-comment-quote</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                  v-if="this.$auth.user.roles.includes('ROLE_ADMIN')"
              >
                {{$t('ogr_leave_retrieve_feedback_title')}}
              </v-list-item-title>
              <v-list-item-title v-else>{{$t('ogr_leave_feedback_title')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              @click="logout()"
          >
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{$t('user_logout')}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-earth</v-icon>
            </v-list-item-icon>
            <v-select
              v-model="selectedLocale"
              :items="availableLocales"
              item-text="code"
              item-value="code"
              style="max-width: 50px;"
              dense
            >
            </v-select>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-dialog
        v-model="showDialog"
        max-width="600px"
      >
        <component :is="dialogComponent" :token="token" @closeDialog="closeDialog"></component>
    </v-dialog>

    <v-dialog
      v-model="showFullscreen"
      fullscreen
      hide-overlay
      persistent
      transition="slide-x-transition"
    >
      <component :is="fullscreenComponent" :token="token" @closeFullscreen="closeFullscreen"></component>
    </v-dialog>

      <v-navigation-drawer
        v-model="showRightDrawer"
        fixed
        hide-overlay
        :width="rightDrawerWidth"
        right
      >
        <v-btn
          small
          fab
          fixed
          right
          top
          outlined
          elevation="2"
          @click="closeRightDrawer"
          icon
        >
          <v-icon dark>
            mdi-chevron-double-right
          </v-icon>
        </v-btn>
        <component :is="rightDrawerComponent"></component>
      </v-navigation-drawer>
  </div>
</template>

<style>

</style>

<script>
import OgrFilterRegionSearch from '../ogr/filter/OgrFilterRegionSearch'
import OgrFilter from '../ogr/filter/OgrFilter'
import SignUp from '../auth/SignUp'
import Loader from '../loading/Loader'
import PasswordChange from '../auth/PasswordChange'
import PasswordReset from '@/components/auth/PasswordReset'
import OgrFilterUserSearch from '@/components/ogr/filter/OgrFilterUserSearch'
import OgrFeedback from '@/components/ogr/comments/OgrFeedback'
import OgrModDashboard from '@/components/ogr/dashboard/moderator/OgrModDashboard'

export default {
  components: {
    OgrFilter,
    OgrFilterRegionSearch,
    OgrFilterUserSearch,
    OgrFeedback,
    SignUp,
    Loader,
    PasswordChange,
    PasswordReset,
    OgrModDashboard
  },
  data: function () {
    return {
      token: '',
      showAlert: false,
      appTitle: 'OpenGeoResearch',
      logo: '/img/logo.png',

      ogrFilterTool: {
        id: 'ogrfilter',
        icon: 'mdi-filter',
        title: 'OGR filter',
        active: true,
        renderAs: 'drawer',
        cmp: 'ogr-filter'
      },
      ogrFilterUserSearch: {
        id: 'ogrfilterusersearch',
        icon: 'mdi-account-search',
        title: 'OGR filter user search',
        active: true,
        renderAs: 'drawer',
        cmp: 'ogr-filter-user-search'
      },
      ogrFeedback: {
        id: 'ogrfeedback',
        icon: 'mdi-message-quote',
        title: 'OGR feedback',
        active: true,
        renderAs: 'drawer',
        cmp: 'ogr-feedback'
      },
      ogrModDashboard: {
        id: 'ogrmoddashboard',
        icon: 'mdi-message-quote',
        title: 'Mod-Dashboard',
        active: true,
        renderAs: 'fullscreen',
        cmp: 'ogr-mod-dashboard'
      },
      ogrEditorDashboard: {
        id: 'ogrEditorDashboard',
        icon: 'mdi-message-quote',
        title: 'Editor-Dashboard',
        active: true,
        renderAs: 'fullscreen',
        cmp: 'ogr-editor-dashboard'
      },
      ogrExpertDashboard: {
        id: 'ogrExpertDashboard',
        icon: 'mdi-message-quote',
        title: 'Expert-Dashboard',
        active: true,
        renderAs: 'fullscreen',
        cmp: 'ogr-expert-dashboard'
      },

      pages: [
        {
          id: 'top',
          route: '/questions/top',
          active: true,
          title: 'top_questions'
        }, {
          id: 'unanswered',
          route: '/questions/unanswered',
          active: true,
          title: 'unanswered_questions'
        }, {
          id: 'newest',
          route: '/questions/newest',
          active: true,
          title: 'newest_questions'
        }
      ],

      login: {
        username: '',
        password: ''
      },

      showRightDrawer: false,
      rightDrawerComponent: undefined,

      showDialog: false,
      dialogComponent: undefined,

      showFullscreen: false,
      fullscreenComponent: undefined
    }
  },
  computed: {
    availableLocales () {
      return this.$i18n.locales
    },
    selectedLocale: {
      get: function () {
        return this.$i18n.locale
      },
      set: function (newValue) {
        if (newValue !== this.$i18n.locale) {
          this.$i18n.setLocale(newValue)
        }
      }
    },
    rightDrawerWidth () {
      if (this.$vuetify.breakpoint.xs || this.isMobile()) {
        return '100%'
      } else {
        return '500'
      }
    }
  },

  methods: {
    activateLoader () {
      this.$store.commit('ogr/Loader', true)
    },
    closeRightDrawer () {
      this.showRightDrawer = false
    },
    closeDialog () {
      this.showDialog = false
    },
    closeFullscreen () {
      this.showFullscreen = false
    },

    async userLogin () {
      this.$store.commit('ogr/Loader', true)
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await this.$auth.loginWith('local', { data: this.login })
        this.showAlert = false
        this.$store.commit('ogr/Loader', false)
        this.login.password = ''
      } catch (err) {
        this.showAlert = true
        this.$store.commit('ogr/Loader', false)
        this.login.password = ''
      }
    },

    logout () {
      this.$auth.logout()
      this.$store.commit('ogr/Loader', false)
    },

    prepareTool (tool) {
      if (tool.renderAs === 'dialog') {
        this.showDialog = true
        this.dialogComponent = tool.cmp
      } else if (tool.renderAs === 'drawer') {
        this.$nuxt.$emit('unselectAll')
        this.$nextTick(() => {
          this.showRightDrawer = true
          this.rightDrawerComponent = tool.cmp
        })
      } else if (tool.renderAs === 'fullscreen') {
        this.showFullscreen = true
        this.fullscreenComponent = tool.cmp
      }
    },
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }
}
</script>
