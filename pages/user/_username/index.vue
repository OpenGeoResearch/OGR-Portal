<template>
  <v-sheet>
    <v-toolbar
      class="pa-0"
      color="primary"
      dark
      flat
    >
    </v-toolbar>
      <v-tabs
        v-model="selectedTab"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-tab key="1"
                 v-bind="attrs"
                 v-on="on">
              <v-icon class="pr-1">mdi-account</v-icon>
            </v-tab>
          </template>
          <span>{{ $t('user_profile_tooltip_profile') }}</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-tab key="2"
                 v-bind="attrs"
                 v-on="on">
              <v-icon class="pr-1">mdi-help-box</v-icon>
            </v-tab>
          </template>
          <span>{{ $t('user_profile_tooltip_questions') }}</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-tab key="3"
               v-bind="attrs"
               v-on="on"
            >
              <v-icon class="pr-1">mdi-message</v-icon>
            </v-tab>
          </template>
          <span>{{ $t('user_profile_tooltip_my_answers') }}</span>
        </v-tooltip>

          <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-tab key="4"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="pr-1">mdi-bookmark</v-icon>
                </v-tab>
              </template>
            <span>{{ $t('user_profile_tooltip_Bookmarks') }}</span>
          </v-tooltip>

      <v-tab-item>
        <user-profile
          v-if="loaded"
          :user-data="userData"
          @update-user-data="getUserData"
        ></user-profile>
      </v-tab-item>

        <v-tab-item>
          <user-profile-questions
            v-if="loaded"
            :user-data="userData"
            @update-user-data="getUserData"
          ></user-profile-questions>
        </v-tab-item>

        <v-tab-item>
          <user-profile-answers
            v-if="loaded"
            :user-data="userData"
            @update-user-data="getUserData"
          ></user-profile-answers>
        </v-tab-item>

        <v-tab-item>
          <user-profile-bookmarks
            v-if="loaded"
            :user-data="userData"
            @update-user-data="getUserData"
          ></user-profile-bookmarks>
        </v-tab-item>
    </v-tabs>
  </v-sheet>

</template>
<script>
import user from '@/apollo/queries/user'
import UserProfile from '@/components/ogr/user/UserProfile'
import UserProfileAnswers from '@/components/ogr/user/UserProfileAnswers'
import UserProfileQuestions from '@/components/ogr/user/UserProfileQuestions'
import UserProfileBookmarks from '@/components/ogr/user/UserProfileBookmarks'

export default {
  components: { UserProfileQuestions, UserProfileAnswers, UserProfileBookmarks, UserProfile },

  data: function () {
    return {
      selectedTab: 0,
      username: this.$route.params.username,
      userData: undefined,
      loaded: false
    }
  },

  created () {
    this.getUserData()
  },

  methods: {
    getUserData () {
      this.$apollo.query({
        query: user,
        variables: {
          username: this.username
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        if (response.data.user) {
          this.userData = response.data.user
          this.loaded = true
        }
      })
    }
  }

}

</script>

<style scoped>

</style>
