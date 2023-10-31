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
export const state = () => ({
  filter: {
    dates: [],
    category: undefined,
    tags: []
  },
  static: {
    functional: ['handled', 'potential', 'answered-exp', 'answered-comm', 'unanswered-exp', 'unanswered-comm', 'exp-inquired-first', 'exp-inquired-second', 'answer-received', 'needs-review', 'closed', 'not-in-series', 'series-child', 'series-parent']
  },
  send: {
    question_id: null,
    expert_id: null,
    round: 'first'
  },
  reject: {
    question_id: null,
    comment: ''
  },
  includedTags: {
    interesting: ['potential']
  }
})

export const mutations = {

  Loader (state, payload) {
    state.loader = payload
  },

  resetFilters (state) {
    state.filter.dates = []
    state.filter.category = undefined
    state.filter.tags = []
  },

  setDates (state, dates) {
    state.filter.dates = dates
  },

  addTag (state, tag) {
    state.filter.tags.push(tag)
  },

  setTags (state, tags) {
    state.filter.tags = tags
  },

  removeTag (state, tag) {
    state.filter.tags = state.filter.tags.filter(item => item !== tag)
  },

  setCategory (state, category) {
    state.filter.category = category
  },

  removeCategory (state) {
    state.filter.category = undefined
  },

  setQuestionToSend (state, id) {
    state.send.question_id = id
  },

  setExpertToSendTo (state, id) {
    state.send.expert_id = id
  },

  setRoundToSend (state, round) {
    state.send.round = round
  },

  resetSend (state) {
    state.send = {
      question_id: null,
      expert_id: null,
      round: 'first'
    }
  },

  setRejectQuestion (state, id) {
    state.reject.question_id = id
  },

  setRejectComment (state, comment) {
    state.reject.comment = comment
  },

  resetReject (state) {
    state.reject = {
      question_id: null,
      comment: ''
    }
  },
}

export const actions = {}
