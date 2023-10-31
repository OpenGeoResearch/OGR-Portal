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
    <user-profile-banner
      v-if="edit === false"
      :username="userData.username"
      :avatar-url="userData.userData ? (userData.userData.avatarUrl ? userData.userData.avatarUrl : '') : ''"
      :banner-url="userData.userData ? (userData.userData.bannerUrl ? userData.userData.bannerUrl : '') : ''"
      :answers="userData.answers ? userData.answers.length : 0"
      :votes="countVotes()"
      @click-edit-profile="edit = true"
    />
    <user-profile-info
      v-if="edit === false"
      :user-data="userData"
    />
    <user-profile-edit-info
      v-if="edit === true"
      :user-data="userData"
      @click-cancel="edit = false"
      @updated-user-data="$emit('update-user-data'); edit = false"
    />
  </div>
</template>

<script>
import UserProfileBanner from '@/components/ogr/user/UserProfileBanner'
import UserProfileInfo from '@/components/ogr/user/UserProfileInfo'
import UserProfileEditInfo from '@/components/ogr/user/UserProfileEditInfo'

export default {
  name: 'UserProfile',
  components: { UserProfileEditInfo, UserProfileInfo, UserProfileBanner },
  props: {
    userData: {
      type: Object,
      required: true,
      default: () => { return {} }
    }
  },

  data () {
    return {
      placeholder: '/img/ogr_placeholder_2.png',
      edit: false
    }
  },

  methods: {
    countVotes () {
      let votes = 0
      const answers = this.userData.answers
      answers.forEach((element) => {
        votes = votes + element.votes.upCount - element.votes.downCount
      })
      const questions = this.userData.questions
      questions.forEach((element) => {
        votes = votes + element.votes.upCount - element.votes.downCount
      })
      return votes
    }
  }
}

</script>

<style scoped>

</style>
