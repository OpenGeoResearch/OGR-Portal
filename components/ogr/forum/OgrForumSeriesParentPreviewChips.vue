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
    <ogr-forum-chip-votes
      :id="parentQuestion.id"
      post-type="POST_TYPE_QUESTION"
      :up="parentQuestion.votes ? parentQuestion.votes.upCount : 0"
      :down="parentQuestion.votes ? parentQuestion.votes.downCount : 0"
    />
    <ogr-forum-chip-number
      v-if="examMode"
      :icon="mdiMapMarkerMultiple"
      :value="'-'"
      :primary="'neutral'"
      :secondary="'#b3b3b3'"
      :tooltip="$t('forum_tooltip_series_elements_hidden').toString()"
    />
    <ogr-forum-chip-number
      v-else
      :icon="mdiMapMarkerMultiple"
      :value="seriesChildren"
      :primary="'#935F00'"
      :secondary="'info'"
      :tooltip="$t('forum_tooltip_series_elements').toString()"
    />
    <ogr-forum-chip-number
      :icon="mdiSchool"
      :value="expertAnswers"
      :primary="'primary'"
      :secondary="'secondary'"
      :tooltip="$t('forum_tooltip_answers_expert').toString()"
    />
    <ogr-forum-chip-number
      :icon="mdiAccountGroup"
      :value="communityAnswers"
      :primary="'primary'"
      :secondary="'secondary'"
      :tooltip="$t('forum_tooltip_answers_community').toString()"
    />
  </div>
</template>

<script>
import { mdiOpenInNew, mdiMapMarkerMultiple, mdiSchool, mdiAccountGroup } from '@mdi/js'
import OgrForumChipVotes from './OgrForumChipVotes'
import OgrForumChipNumber from '@/components/ogr/forum/OgrForumChipNumber'

export default {
  name: 'OgrForumSeriesParentPreviewChips',
  components: { OgrForumChipNumber, OgrForumChipVotes },
  props: {
    id: {
      type: String,
      required: true
    },
    parentQuestion: {
      type: Object,
      required: true
    },
    communityAnswers: {
      type: Number,
      required: true
    },
    expertAnswers: {
      type: Number,
      required: true
    },
    seriesChildren: {
      type: Number,
      required: true
    },
    examMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      mdiOpenInNew,
      mdiMapMarkerMultiple,
      mdiSchool,
      mdiAccountGroup,
      ogrApiUrl: this.$config.ogrApiUrl,
      ogrMapUrl: this.$config.ogrMapUrl,
      show: false
    }
  }
}

</script>
