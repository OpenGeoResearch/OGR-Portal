/*
*    Copyright (C) 2023 Geodätisches Institut RWTH Aachen University,
*    Mies-van-der-Rohe-Straße 1, D 52074 Aachen, Germany.
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import colors from './assets/colors'

export default {
  ssr: false,
  /*
    ** Headers of the page
    */
  head: {
    titleTemplate: 'OpenGeoResearch',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  router: {
    extendRoutes (routes, resolve) {
      routes.push(
        {
          path: '/external/:link(.*)*',
          component: resolve(__dirname, 'pages/external/_link/index.vue')
        }
      )
    }
  },
  /*
    ** Customize the progress-bar color
    */
  loading: { color: '#fff' },
  /*
    ** Global CSS
    */
  css: [
    '@/assets/normalize.css'
  ],
  /*
    ** Plugins to load before mounting the App
    */
  plugins: [{
    src: '@/plugins/vuelayers.js',
    ssr: false,
    mode: 'client'
  }, {
    src: '@/plugins/ol.js',
    ssr: false,
    mode: 'client'
  }, {
    src: '~/plugins/vue-filter-date-format',
    ssr: false
  }, {
    src: '~/plugins/vue-filter-date-parse',
    ssr: false
  }, {
    src: '~/plugins/vue-treeselect.js',
    ssr: false
  }, {
    src: '~/plugins/vue2-filters'
  }],
  /*
    ** Nuxt.js dev-modules
    */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    '@nuxtjs/i18n'
  ],
  /*
    ** Nuxt.js modules
    */
  modules: [
    '@/modules/vuelayers'
  ],
  components: true,
  /*
    ** vuetify module configuration
    ** https://github.com/nuxt-community/vuetify-module
    */
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          // standard colors
          primary: colors.green.base,
          accent: colors.red.base,
          secondary: colors.lightGreen.base,
          info: colors.brown.base,
          warning: colors.red.base,
          error: colors.purple.base,
          success: colors.green.base,
          // custom colors
          confirm: colors.green.lighten2,
          deny: colors.red.lighten3,
          placeholder: colors.grey.base,
          highlight: colors.lightGreen.lighten2,
          external: colors.lightGreen.lighten2,
          caution: colors.purple.lighten3,
          positive: colors.lightGreen.lighten1,
          negative: colors.red.lighten2,
          neutral: colors.grey.darken2,
          background: colors.grey.lighten2
        },
        dark: {
          // standard colors
          primary: colors.green.darken2,
          accent: colors.red.darken2,
          secondary: colors.lightGreen.darken3,
          info: colors.brown.darken2,
          warning: colors.red.darken2,
          error: colors.purple.darken2,
          success: colors.green.darken2,
          // custom colors
          confirm: colors.green.lighten2,
          deny: colors.red.lighten3,
          placeholder: colors.grey.base,
          highlight: colors.lightGreen.lighten2,
          external: colors.red.darken2,
          caution: colors.purple.lighten3,
          positive: colors.lightGreen.lighten1,
          negative: colors.red.lighten2,
          neutral: colors.grey.darken1,
          background: colors.grey.base
        }
      }
    }
  },

  /*
    ** Build configuration
    */
  build: {
    transpile: ['ol', 'vue-filter-date-format', 'vue-filter-date-parse'],
    loaders: {
      css: {
        modules: false
      }
    }
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'accessToken'
        },
        endpoints: {
          login: { url: '/ogr/auth/login', method: 'post', propertyName: 'accessToken' },
          logout: false,
          user: { url: '/ogr/auth/user', method: 'get', propertyName: false }
        }
      }
    },
    redirect: {
      login: false,
      logout: false,
      home: false,
      callback: false
    }
  },

  axios: {
    baseURL: 'https://localhost:8080'
  },

  apollo: {
    clientConfigs: {
      default: '~/apollo.config.js'
    }
  },

  i18n: {
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    locales: [{
      code: 'en',
      name: 'English',
      iso: 'en-US',
      file: 'en.json'
    }, {
      code: 'de',
      name: 'Deutsch',
      iso: 'de-DE',
      file: 'de.json'
    }],
    defaultLocale: 'de',
    fallbackLocale: 'de'
  },
  publicRuntimeConfig: {
    ogrApiUrl: process.env.OGR_API_URL || 'https://localhost:8080',
    ogrStaUrl: process.env.OGR_STA_URL || 'https://localhost:8080',
    ogrMapUrl: process.env.OGR_MAP_URL || 'https://localhost:8080',
    ogrHpUrl: process.env.OGR_HP_URL || 'https://localhost:8080',
    ogrGeoUrl: process.env.OGR_GEO_URL || 'https://localhost:8080',
    ogrPwaUrl: process.env.OGR_PWA_URL || 'https://localhost:8080',
    axios: {
      baseURL: process.env.OGR_API_URL
    },
    auth: {
      strategies: {
        local: {
          login: process.env.OGR_API_URL + '/ogr/auth/login'
        }
      }
    }
  }
}
