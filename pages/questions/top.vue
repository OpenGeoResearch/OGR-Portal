<template>
  <div v-if="!topVotedQuestions">
    <v-skeleton-loader class="mb-3" type="article" elevation="2" v-for="n in 10" :key="n"></v-skeleton-loader>
  </div>
    <v-card v-else-if="topVotedQuestions">
      <v-toolbar
        class="pa-0"
        color="primary"
        dark
      >
        <v-row>
          <v-col cols="2"></v-col>
          <v-col class="d-flex justify-space-around">
            <v-toolbar-title>{{$t('top_questions')}}</v-toolbar-title>
          </v-col>
          <v-col
            cols="2"
            class="d-flex justify-end"
          >
          </v-col>
        </v-row>
      </v-toolbar>
      <template v-for="q in topVotedQuestions">
        <ogr-forum-question-preview
          v-if="q"
          :question="q"
          :key="q.id"
        >
        </ogr-forum-question-preview>
      </template>
    </v-card>
</template>

<script>
import topVotedQuestions from '~/apollo/queries/topVotedQuestions.gql'
import OgrForumQuestionPreview from '../../components/ogr/forum/OgrForumQuestionPreview'

export default {
  components: { OgrForumQuestionPreview },

  data: function () {
    return {
    }
  },

  apollo: {
    topVotedQuestions: {
      query: topVotedQuestions,
      prefetch: true,
      variables () {
        return { size: 30 }
      }
    }
  },

  beforeRouteLeave (to, from, next) {
    this.$store.commit('ogr/removeQuestionIds')
    this.$nuxt.$emit('updateLayer', 'OGR')
    this.$nuxt.$emit('updateLayer', 'OGR_Cluster')
    next()
  },

  watch: {
    topVotedQuestions () {
      this.$store.commit('ogr/resetFilters')
      this.$store.commit('ogr/setQuestionIds', this.topVotedQuestions.map(question => question.id))
      this.$nuxt.$once('mapinitcomplete', () => {
        setTimeout(() => this.$nuxt.$emit('updateLayer', 'OGR'), 500)
      })
      this.$nuxt.$emit('updateLayer', 'OGR', true)
      this.$nuxt.$emit('updateLayer', 'OGR_Cluster', true)
    }
  }
}

</script>
