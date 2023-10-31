<template>
  <v-container>
    <v-card>
      <v-alert
        :value="alert"
        outlined
        dense
        type="info"
        text
        transition="scale-transition"
      >
        {{ message }}
      </v-alert>

      <v-card-title>
        {{$t('search_user')}}
      </v-card-title>

      <v-form
        v-model="validSelection"
      >
        <v-autocomplete
          class="px-2"
          single-line
          v-model="userToModify"
          :items="userNames"
          :search-input.sync="search"
          :placeholder="$t('ogr_filter_searchbar_user')"
          :label="$t('ogr_filter_searchbar_user')"
          item-text="attributes.NAME"
          item-value="attributes.OBJECTID"
          hide-no-data
          :rules="[rules.userRequired]"
        >
          <template v-slot:item="{item}">
            <template v-if="typeof item !== 'object'">
              <v-list-item-content v-text="item"></v-list-item-content>
            </template>
            <template v-else>
              <v-list-item-content>
                <v-list-item-title v-text="item.attributes.NAME"></v-list-item-title>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>

        <v-combobox
          class="px-2"
          v-model="selectedAction"
          :label="$t('ogr_filter_choose_action')"
          :items="actions"
          item-text="label"
          item-value="action"
          :rules="[rules.actionRequired]"
        >
        </v-combobox>

        <v-combobox
          v-if="selectedAction.action === 'ACTION_ADD_ROLE'"
          class="px-2"
          v-model="roleToAdd"
          :label="$t('ogr_filter_choose_role')"
          item-text="label"
          item-value="id"
          :items="rolesToAdd"
        >
        </v-combobox>
        <v-combobox
          v-if="selectedAction.action === 'ACTION_REMOVE_ROLE'"
          class="px-2"
          v-model="roleToRemove"
          :label="$t('ogr_filter_choose_role')"
          item-text="label"
          item-value="id"
          :items="rolesToRemove"
        >
        </v-combobox>
        <v-btn
          :disabled="!validSelection"
          class="ml-2 mb-2"
          color="secondary"
          @click="performAction"
        >
         {{$t('confirm')}}
        </v-btn>
        <v-btn
          :disabled="!userToModify"
          :to="`/user/${userToModify}`"
          class="ml-2 mb-2"
          color="secondary"
        >
          {{$t('ogr_view_profile')}}
        </v-btn>
      </v-form>
      <v-alert v-if="actionDone">{{$t('ogr_filter_action_performed')}}</v-alert>
    </v-card>
  </v-container>
</template>

<script>

export default {
  name: 'OgrFilterUserSearch',
  data () {
    return {
      ogrApiUrl: this.$config.ogrApiUrl,
      alert: false,
      actionDone: false,
      userToModify: undefined,
      search: null,
      selectedAction: '',
      validSelection: false,
      roleToAdd: undefined,
      roleToRemove: undefined,
      userNames: [],
      currentRoles: [],
      message: '',
      rules: {
        userRequired: (v) => {
          return !!v || this.$t('ogr_filter_rule_search_user')
        },
        actionRequired: (v) => {
          return !!v || this.$t('ogr_filter_rule_choose_action')
        }
      }
    }
  },

  computed: {
    items () {
      return this.userNames
    },
    actions () {
      return [
        { action: 'ACTION_BAN', label: this.$t('user_management_action_ban') },
        { action: 'ACTION_ADD_ROLE', label: this.$t('user_management_action_add_role') },
        { action: 'ACTION_REMOVE_ROLE', label: this.$t('user_management_action_remove_role') }
      ]
    },
    rolesToAdd () {
      let roles = [
        { id: 1, label: 'Benutzer:In', enum: 'ROLE_USER' },
        { id: 2, label: 'Expert:In', enum: 'ROLE_EXPERT' },
        { id: 3, label: 'Moderator:In', enum: 'ROLE_MODERATOR' },
        { id: 4, label: 'Editor:In', enum: 'ROLE_EDITOR' },
        { id: 6, label: 'Lehrer:In', enum: 'ROLE_TEACHER' }
      ]
      for (const role of this.currentRoles) {
        if (role === 'ROLE_USER') {
          roles = roles.filter(function (el) { return el.id !== 1 })
        } else if (role === 'ROLE_EXPERT') {
          roles = roles.filter(function (el) { return el.id !== 2 })
        } else if (role === 'ROLE_MODERATOR') {
          roles = roles.filter(function (el) { return el.id !== 3 })
        } else if (role === 'ROLE_EDITOR') {
          roles = roles.filter(function (el) { return el.id !== 4 })
        } else if (role === 'ROLE_TEACHER') {
          roles = roles.filter(function (el) { return el.id !== 6 })
        }
      }
      roles.sort(function (a, b) {
        return a.id - b.id
      })
      return roles
    },
    rolesToRemove () {
      const roles = []
      for (const role of this.currentRoles) {
        if (role === 'ROLE_USER') {
          roles.push({ id: 1, label: 'Benutzer:In', enum: 'ROLE_USER' })
        } else if (role === 'ROLE_EXPERT') {
          roles.push({ id: 2, label: 'Expert:In', enum: 'ROLE_EXPERT' })
        } else if (role === 'ROLE_MODERATOR') {
          roles.push({ id: 3, label: 'Moderator:In', enum: 'ROLE_MODERATOR' })
        } else if (role === 'ROLE_EDITOR') {
          roles.push({ id: 4, label: 'Editor:In', enum: 'ROLE_EDITOR' })
        } else if (role === 'ROLE_TEACHER') {
          roles.push({ id: 4, label: 'Lehrer:In', enum: 'ROLE_TEACHER' })
        }
      }
      roles.sort(function (a, b) {
        return a.id - b.id
      })
      return roles
    }
  },

  watch: {
    search (val) {
      if (val == null) return
      // Items have already been requested
      if (this.isLoading) return

      if (val.length >= 3) {
        this.isLoading = true
        this.$axios.get(this.ogrApiUrl + '/ogr/users?query=' + val, { headers: { Authorization: this.$auth.getToken('local') } })
          .then(res => {
            this.userNames = res.data
          })
          .catch(err => {
          })
          .finally(() => (this.isLoading = false))
      } else {
        this.features = []
      }
    },
    userToModify () {
      if (this.userToModify) {
        this.getRoles()
      }
    }
  },

  methods: {
    showAlert (message) {
      this.message = message
      this.loading = false
      this.alert = true
    },
    resetInput () {
      this.userToModify = undefined
      this.selectedAction = ''
    },
    async getRoles () {
      this.$axios.get('/ogr/user/' + this.userToModify + '/roles', { headers: { Authorization: this.$auth.getToken('local') } })
        .then((response) => {
          if (response.status === 200) {
            this.currentRoles = response.data
          }
        })
        .catch(() => {
          this.showAlert(this.$t('alert_error_occurred'))
        })
    },
    async performAction () {
      if (this.selectedAction.action === 'ACTION_ADD_ROLE') {
        this.$axios.post('/ogr/user/' + this.userToModify + '/roles', [this.roleToAdd.enum])
          .then((response) => {
            if (response.status === 200) {
              this.actionDone = true
              this.resetInput()
            }
          })
          .catch(() => {
            this.showAlert(this.$t('alert_error_occurred'))
          })
      } else if (this.selectedAction.action === 'ACTION_REMOVE_ROLE') {
        this.$axios.delete('/ogr/user/' + this.userToModify + '/roles', { headers: { Authorization: this.$auth.getToken('local') }, data: [this.roleToRemove.enum] })
          .then((response) => {
            if (response.status === 200) {
              this.actionDone = true
              this.resetInput()
            }
          })
          .catch(() => {
            this.showAlert(this.$t('alert_error_occurred'))
          })
      } else if (this.selectedAction.action === 'ACTION_BAN') {
        this.$axios.post('/ogr/user/' + this.userToModify + '/status', '"STATUS_BANNED"', { headers: { 'Content-Type': 'application/json' } })
          .then((response) => {
            if (response.status === 200) {
              this.actionDone = true
              this.resetInput()
            }
          })
          .catch(() => {
            this.showAlert(this.$t('alert_error_occurred'))
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
