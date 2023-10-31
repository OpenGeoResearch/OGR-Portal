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
    <v-row>
      <v-btn
        v-if="this.$auth.loggedIn"
        color="green"
        icon
        @click="vote('VOTE_UP')"
      >
        <v-icon>mdi-chevron-up</v-icon>
        {{question.votes.upCount}}
      </v-btn>
      <v-btn
        v-if="!this.$auth.loggedIn"
        class="disable-events"
        color="green"
        icon
      >
        <v-icon>mdi-chevron-up</v-icon>
        {{question.votes.upCount}}
      </v-btn>
    </v-row>
    <v-row>
      <v-btn
        v-if="this.$auth.loggedIn"
        color="red"
        icon
        @click="vote('VOTE_DOWN')"
      >
        <v-icon>mdi-chevron-down</v-icon>
        {{question.votes.downCount}}
      </v-btn>

      <v-btn
        v-if="!this.$auth.loggedIn"
        class="disable-events"
        color="red"
        icon
      >
        <v-icon>mdi-chevron-down</v-icon>
        {{question.votes.downCount}}
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable vue/no-mutating-props */

import gql from 'graphql-tag'
export default {
  props: {
    question: Object
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
                                questionVote(
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
            id: this.question.id,
            voteDirection: voteDirection
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.question.votes = response.data.questionVote.votes
        })
      } else {
        alert('login or signup first')
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
