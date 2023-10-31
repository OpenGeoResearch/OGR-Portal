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
  <v-sheet v-if="seriesData">
    <v-toolbar
      class="pa-0"
      color="info"
      dark
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            @click="goToAllSeries"
          >
            {{ mdiArrowLeft }}
          </v-icon>
        </template>
        <span>{{ $t('series_all') }}</span>
      </v-tooltip>
      <v-spacer />
      <v-toolbar-title>{{ seriesData.name }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <template v-for="q in seriesChildren">
      <ogr-forum-series-child-preview
        v-if="q"
        :question="q"
        :key="q.id"
        :series-data="seriesData"
      >
      </ogr-forum-series-child-preview>
    </template>
  </v-sheet>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js'
import questionSeriesById from '~/apollo/queries/questionSeriesById.gql'
import question from '~/apollo/queries/question.gql'
import questionSeriesChildren from '~/apollo/queries/questionSeriesChildren.gql'
import OgrForumSeriesChildPreview from '../../../components/ogr/forum/OgrForumSeriesChildPreview'

export default {
  components: { OgrForumSeriesChildPreview },
  data () {
    return {
      mdiArrowLeft,
      seriesId: undefined,
      seriesData: undefined,
      open: false,
      seriesParent: undefined,
      seriesChildren: undefined
    }
  },

  mounted () {
    this.seriesId = this.$route.params.id
    this.getSeriesData()
    this.getSeriesChildren()
  },

  methods: {
    goToAllSeries () {
      this.$router.push('/series/')
    },
    checkSeriesStatus () {
      this.open = Date.now() < Date.parse(this.seriesData.end)
    },
    getSeriesData () {
      this.$apollo.query({
        query: questionSeriesById,
        variables: {
          id: this.seriesId
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.seriesData = response.data.questionSeriesById
        this.checkSeriesStatus()
        this.getSeriesParent()
      })
    },
    getSeriesParent () {
      this.$apollo.query({
        query: question,
        variables: {
          id: this.seriesData.parentQuestion.id
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.seriesParent = response.data.question
      })
    },
    getSeriesChildren () {
      this.$apollo.query({
        query: questionSeriesChildren,
        variables: {
          id: this.seriesId
        },
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }
      }).then((response) => {
        this.seriesChildren = response.data.questionSeriesChildren
      })
    }
  }
}
</script>
