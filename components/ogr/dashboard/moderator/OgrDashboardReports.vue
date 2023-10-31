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
  <v-row no-gutters>
    <v-col
      cols="12"
    >
      <v-form v-model="isFormValid">
        <v-data-table
          :headers="headers"
          :items="reports"
          sort-by="ID"
          class="elevation-1"
          single-expand
          show-expand
          :expanded.sync="expanded"
        >
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Reports</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.created="{ item }">
            {{ item.created | dateParse('YYYY-MM-DD HH:mm') | dateFormat('DD.MM.YYYY - HH:mm') }}
          </template>
          <template v-slot:item.id="{ item }">
            <span> {{ getQuestion(item) }}</span>
          </template>
          <template v-slot:item.reason="{ item }">
            <span> {{ item.reason.name }}</span>
          </template>
          <template v-slot:item.reporter="{ item }">
            <span> {{ item.user.username }}</span>
          </template>
          <template v-slot:item.user="{ item }">
            <span> {{ getUsername(item) }}</span>
          </template>
          <template v-slot:item.type="{ item }">
            <span>{{ getType(item) }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              class="mr-2"
              @click="inactivatereport(item)"
            >
              mdi-check
            </v-icon>
            <v-icon
              @click="deleteDialog(item)"
            >
              mdi-delete
            </v-icon>
            <v-icon
              @click="banDialog(item)"
            >
              mdi-account-cancel
            </v-icon>
            <v-btn
              :href="goTo(item)"
              target="_blank"
              icon
            >
              <v-icon
              >
                mdi-open-in-new
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <v-card-subtitle>Begründung:</v-card-subtitle>
              <v-card-text>{{ item.text }}</v-card-text>
              <v-card-subtitle>Inhalt:</v-card-subtitle>
              <v-card-text v-if="item.answer">{{ item.answer.content }}</v-card-text>
              <v-card-text v-else-if="item.questionComment">{{ item.questionComment.content }}</v-card-text>
              <v-card-text v-else-if="item.answerComment">{{ item.answerComment.content }}</v-card-text>
            </td>
          </template>
        </v-data-table>
      </v-form>
      <v-dialog v-model="dialog.delete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Beitrag wirklich löchen?</v-card-title>
          <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog.delete = false">Abbrechen</v-btn>
            <v-btn color="primary" text @click="deletePost()">Ja</v-btn>
          <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog.ban" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">User wirklich sperren?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog.ban = false">Abbrechen</v-btn>
            <v-btn color="primary" text @click="banUser()">Ja</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import reports from '@/apollo/queries/reports'
import inactivateReport from '@/apollo/mutations/inactivateReport'
import deleteReportedAnswer from '@/apollo/mutations/deleteReportedAnswer'
import deleteReportedQuestionComment from '@/apollo/mutations/deleteReportedQuestionComment'
import deleteReportedAnswerComment from '@/apollo/mutations/deleteReportedAnswerComment'
import deleteReportedQuestion from '@/apollo/mutations/deleteReportedQuestion'
import banReportedUser from '@/apollo/mutations/banReportedUser'

export default {
  name: 'OgrDashboardReports',
  data () {
    return {
      item: undefined,
      expanded: [],
      isFormValid: false,
      showAlert: false,
      dialogDelete: false,
      headers: [
        { text: 'Frage', align: 'start', value: 'id' },
        { text: 'Datum', value: 'created' },
        { text: 'Reporter', value: 'reporter' },
        { text: 'Meldegrund', value: 'reason' },
        { text: 'User', value: 'user' },
        { text: 'Typ', value: 'type', sortable: false },
        { text: 'Optionen', value: 'actions', sortable: false },
        { text: '', value: 'data-table-expand' }
      ],
      dialog: {
        delete: false,
        ban: false
      }
    }
  },

  apollo: {
    reports: {
      query: reports,
      fetchPolicy: 'no-cache',
      prefetch: true,
      skip () {
        return !this.$auth.loggedIn
      },
      context () {
        return {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }
    }
  },

  methods: {
    closeDialog () {
      this.showAlert = false
      this.$emit('closeDialog')
    },
    inactivatereport (item) {
      this.$apollo.mutate({
        mutation: inactivateReport,
        variables: {
          id: item.id
        },
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.reports = response.data.inactivateReport
      })
    },
    deleteDialog (item) {
      this.item = item
      this.dialog.delete = true
    },
    banDialog (item) {
      this.item = item
      this.dialog.ban = true
    },
    deletePost () {
      const item = this.item
      if (item.answer) {
        this.$apollo.mutate({
          mutation: deleteReportedAnswer,
          variables: {
            id: item.answer.id
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.reports = response.data.deleteReportedAnswer
        })
      } else if (item.questionComment) {
        this.$apollo.mutate({
          mutation: deleteReportedQuestionComment,
          variables: {
            id: item.questionComment.id
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.reports = response.data.deleteReportedQuestionComment
        })
      } else if (item.answerComment) {
        this.$apollo.mutate({
          mutation: deleteReportedAnswerComment,
          variables: {
            id: item.answerComment.id
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.reports = response.data.deleteReportedAnswerComment
        })
      } else if (item.question) {
        this.$apollo.mutate({
          mutation: deleteReportedQuestion,
          variables: {
            id: item.question.id
          },
          context: {
            headers: {
              Authorization: this.$auth.getToken('local')
            }
          }
        }).then((response) => {
          this.reports = response.data.deleteReportedQuestion
        })
      }
      this.dialog.delete = false
    },
    banUser () {
      const item = this.item
      if (this.getUsername(item) !== '---') {
        if (item.answer) {
          this.$apollo.mutate({
            mutation: banReportedUser,
            variables: {
              id: item.id,
              username: item.answer.user.username
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            this.reports = response.data.banReportedUser
          })
        } else if (item.questionComment) {
          this.$apollo.mutate({
            mutation: banReportedUser,
            variables: {
              id: item.id,
              username: item.questionComment.user.username
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            this.reports = response.data.banReportedUser
          })
        } else if (item.answerComment) {
          this.$apollo.mutate({
            mutation: banReportedUser,
            variables: {
              id: item.id,
              username: item.answerComment.user.username
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            this.reports = response.data.banReportedUser
          })
        } else if (item.question) {
          this.$apollo.mutate({
            mutation: banReportedUser,
            variables: {
              id: item.id,
              username: item.question.user.username
            },
            context: {
              headers: {
                Authorization: this.$auth.getToken('local')
              }
            }
          }).then((response) => {
            this.reports = response.data.banReportedUser
          })
        }
      }
      this.dialog.ban = false
    },
    goTo (item) {
      if (item.answer) {
        return '/question/' + item.answer.question.id
      } else if (item.questionComment) {
        return '/question/' + item.questionComment.question.id
      } else if (item.answerComment) {
        return '/question/' + item.answerComment.answer.question.id
      } else {
        return '/question/' + item.question.id
      }
    },
    getQuestion (item) {
      if (item.answer) {
        return item.answer.question.id
      } else if (item.questionComment) {
        return item.questionComment.question.id
      } else if (item.answerComment) {
        return item.answerComment.answer.question.id
      } else {
        return item.question.id
      }
    },
    getUsername (item) {
      if (item.answer) {
        if (item.answer.user) {
          return item.answer.user.username
        }
      } else if (item.questionComment) {
        if (item.questionComment.user) {
          return item.questionComment.user.username
        }
      } else if (item.answerComment) {
        if (item.answerComment.user) {
          return item.answerComment.user.username
        }
      } else {
        if (item.question.user) {
          return item.question.user.username
        }
      }
      return '---'
    },
    getType (item) {
      if (item.answer) {
        return 'Antwort'
      } else if (item.questionComment) {
        return 'Kommentar (Frage)'
      } else if (item.answerComment) {
        return 'Kommentar (Antwort)'
      } else {
        return 'Frage'
      }
    }
  }
}
</script>

<style scoped>

</style>
