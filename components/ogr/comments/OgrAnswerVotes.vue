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
  <v-container>
      <v-btn
        v-if="this.$auth.loggedIn"
        color="green"
        icon
        small
        @click="vote('VOTE_UP')"
      >
        <v-icon>mdi-chevron-up</v-icon>
        {{answer.votes.upCount}}
      </v-btn>
      <v-btn
        v-if="!this.$auth.loggedIn"
        color="green"
        icon
        class="disable-events"
        small
      >
        <v-icon>mdi-chevron-up</v-icon>
        {{answer.votes.upCount}}
      </v-btn>

      <v-btn
        v-if="this.$auth.loggedIn"
        color="red"
        icon
        small
        @click="vote('VOTE_DOWN')"
      >
        <v-icon>mdi-chevron-down</v-icon>
        {{answer.votes.downCount}}
      </v-btn>
    <v-btn
      v-if="!this.$auth.loggedIn"
      color="red"
      icon
      class="disable-events"
      small
    >
      <v-icon>mdi-chevron-down</v-icon>
      {{answer.votes.downCount}}
    </v-btn>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
export default {
  props: {
    answer: Object
  },
  methods: {
    vote (voteDirection) {
      if (this.$auth.loggedIn) {
        this.$apollo.mutate({
          mutation: gql`
                            mutation(
                                $id: ID!
                                $voteDirection: VoteDirection!
                            ) {
                                answerVote(
                                    id: $id,
                                    voteDirection: $voteDirection
                                ) {
                                    votes {
                                      upCount
                                      downCount
                                    }
                                }
                            }
                        `,
          variables: {
            id: this.answer.id,
            voteDirection: voteDirection
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          // eslint-disable-next-line vue/no-mutating-props
          this.answer.votes = response.data.answerVote.votes
        })
      } else {
        alert('login first')
      }
    }
  }
}

</script>

<style scoped>
.disable-events {
  pointer-events: none
}
</style>
