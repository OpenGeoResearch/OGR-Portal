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
      <v-spacer></v-spacer>
      <v-col cols="10">
        <v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-step
              :complete="step > 1"
              step="1"
            >
              Serie konfigurieren
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :complete="step > 2"
              step="2"
            >
              Informationen hinzufügen
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :complete="step > 3"
              step="3"
            >
              Serie Erstellen
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="4">
              Mitforschen
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card>
                <v-card-title class="pl-0">
                  <v-icon
                    large
                    left
                  >
                    mdi-plus
                  </v-icon>
                  <span class="text-h5 font-weight-light">Neue Serie erstellen</span>
                </v-card-title>

                <v-form
                  class="pa-3"
                  ref="series-form"
                  v-model="isSeriesFormValid"
                >
                  <!-- Input: Name -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Gib deiner Serie einen aussagekräftigen Namen:</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Der Name sollte das wesentliche Thema der Serie enthalten. Zum Beispiel:
                      <ul>
                        <li>Sturmschäden in Paderborn</li>
                        <li>Historische Stadtbefestigung in Aachen</li>
                        <li>Hochwasser in der Eifel</li>
                      </ul>
                    </span>
                  </v-card-text>
                  <v-text-field
                    v-model="series.name"
                    label="Gib hier den Namen der Serie ein"
                    dense
                    outlined
                    :rules="[rules.required, rules.maxLength(40), rules.minLength(10)]"
                    counter="40"
                  ></v-text-field>

                  <!-- Input: Tag -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Gib deiner Serie einen aussagekräftigen Tag:</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Um die Serie eindeutig zu identifizieren musst du einen Tag vergeben. Zum Beispiel:
                      <ul>
                        <li>s_tornado_owl_2022</li>
                        <li>s_stadtbefestigung_aachen</li>
                        <li>s_hochwasser_eifel_2021</li>
                      </ul>
                      Das "s_" am Anfang des Tags wird automatisch hinzugefügt. Gib also z.B. nur "stadtbefestigung_aachen". Daraus wird dann automatisch "s_stadtbefestigung_aachen". Zur Sicherheit musst du den Tag überprüfen (grüner Button unten) bevor du weiter machen kannst.
                    </span>
                  </v-card-text>
                  <v-text-field
                    v-model="series.tag"
                    label="Gib hier den Tag der Serie ein"
                    prefix="s_"
                    dense
                    outlined
                    :rules="[rules.required, rules.maxLength(30), rules.minLength(8), rules.tag]"
                    counter="30"
                  ></v-text-field>
                  <v-btn
                    class="mt-0 pt-0 mb-3"
                    color="secondary"
                    small
                    :disabled="series.tag === undefined"
                    @click="checkSeriesTag"
                  >
                    Tag überprüfen
                  </v-btn>
                  <span v-if="seriesTagChecked">{{ seriesTagIsUnique ? 'Dieser Tag ist verfügbar!' : 'Dieser Tag ist bereits vergeben!' }}</span>

                  <!-- Input: Datum -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Gib an, bis wann die Serie offen bleiben soll:</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Du kannst einstellen wie lange die Serie offen für neue Elemente sein soll. Bis zu dem von dir ausgewählten datum können neue Elemente durch Teilnehmer*Innen zur Serie hinzugefügt werden.</span>
                  </v-card-text>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Wähle das Enddatum der Serie aus (Bis dahin können Fragen hinzugefügt werden)"
                        dense
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      @input="menu = false"
                      :allowed-dates="isDateInTheFuture"
                    ></v-date-picker>
                  </v-menu>

                  <!-- Input: Exam -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Gib an, ob Beiträge zur Serie versteckt werden sollen:</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Für einige Lehrveranstaltungen kann es sinnvoll sein, wenn die Beiträge erst angezeigt werden, wenn die Serie nicht mehr geöffnet ist. Wenn du diese Option aktivierst, dann werden alle Serienelemente verborgen und nach dem von dir weiter oben ausgewählten Datum angezeigt.</span>
                  </v-card-text>
                  <v-checkbox
                    v-model="series.exam"
                    class="ma-0 pa-0"
                    label="Ja, die Serienelemente verstecken."
                  />
                </v-form>

                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                    color="primary"
                    :disabled="!(isSeriesFormValid && seriesTagIsUnique)"
                    @click="step = 2"
                  >
                    weiter
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card>
                <v-card-title class="pl-0">
                  <v-icon
                      large
                      left
                  >
                    mdi-text-box-edit-outline
                  </v-icon>
                  <span class="text-h5 font-weight-light">Informationen zur Serie hinzufügen</span>
                </v-card-title>

                <v-form
                  class="pa-3"
                  ref="question-form"
                  v-model="isQuestionFormValid"
                >
                  <!-- Input: Position -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Positioniere die Serie auf der Karte::</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Deine Serie wird mit einem Marker (ähnlich wie eine normal Frage) auf unserer Karte im Fragenportal angezeigt. Wähle dazu eine möglichst passende Position auf der Karte.</span>
                  </v-card-text>
                  <ogr-map-mini
                    v-if="step === 2"
                    :map.sync="map"
                    :marker-coords.sync="markerCoords"
                  />
                  <ogr-map-list
                    :lat="markerCoords[1].toFixed(7)"
                    :lon="markerCoords[0].toFixed(7)"
                    @click-dialog-open="openPositionDialog"
                  />
                  <ogr-map-dialog
                    v-if="dialog.location"
                    :active="dialog.location"
                    :map.sync="map"
                    :marker-coords.sync="markerCoords"
                    @click-dialog-close="cancelPositionDialog"
                    @click-dialog-submit="submitMarkerPosition"
                  />

                  <!-- Input: Frage -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Stelle eine übergeordnete Frage zu deiner Serie:</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Deine Serie benötigt eine übergeordnete Frage. Zum Beispiel:
                      <ul>
                        <li>Sind das teile einer historischen Stadbefestigung?</li>
                        <li>Was können wir aus Hochwasserschäden lernen?</li>
                        <li>Tritt dieses Phänomen lokal begrenzt auf?</li>
                      </ul>
                    </span>
                  </v-card-text>
                  <v-textarea
                    v-model="question.question"
                    :rules="[rules.required, rules.minLength(20) ,rules.maxLength(200)]"
                    counter="200"
                    outlined
                    dense
                    label="Gib hier deine Frage ein"
                    placeholder=""
                    rows="1"
                  />

                  <!-- Input: Beschreibung -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Beschreibe deine Serie:</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Eine ausführliche Beschreibung der Serie hilft Anderen die Serie zu verstehen und erhöht das Interesse an der Serie mitzuwirken. Von Interesse sind zum Beispiel:
                      <ul>
                        <li>Was ist das Ziel der Serie? Welche Informationen sind enthalten?</li>
                        <li>Was gehört in die Serie und was nicht?</li>
                        <li>Wer kann/soll mitwirken?</li>
                      </ul>
                    </span>
                  </v-card-text>
                  <v-textarea
                    v-model="question.description"
                    :rules="[rules.maxLength(4000)]"
                    counter="4000"
                    outlined
                    dense
                    placeholder="Gib hier deine Beschreibung ein"
                    rows="3"
                  />

                  <!-- Input: Kategorisierung -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Gib eine Kategorie zur Serie an:</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Die Einordnung in einen Forschungsbereich hilft Anderen Serien von Interesse zu finden.</span>
                  </v-card-text>
                  <ogr-input-classification
                      v-model="question.category"
                  ></ogr-input-classification>

                  <!-- Input: Tags -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Beschreibe deine Serie mit Tags:</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Durch Tags wird deine Serie besser auffindbar. Wähle einige Schlagworte, die das Thema der Serie widerspiegeln.</span>
                  </v-card-text>
                  <ogr-input-tags
                    v-model="question.tags"
                  />

                  <!-- Input: Fotos -->
                  <v-divider />
                  <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Füge Fotos hinzu:</span></v-card-text>
                  <v-card-text class="pl-0 pt-0">
                    <span>Durch Fotos wird deine Serie interessanter und ist leichter verständlich. Um Bilder hochzuladen klicke einfach auf das grüße Plus-Symbol.</span>
                  </v-card-text>
                  <ogr-input-image
                    class="mb-4"
                    @input-media-image="updateImages"
                    @input-media-too-large="showSnackbar($t('input_media_too_large'))"
                  ></ogr-input-image>

                  <v-divider class="mb-4" />
                  <v-row no-gutters>
                    <v-checkbox
                      v-model="checkbox"
                      :rules="[rules.required]"
                      class="ma-0 pa-0"
                    />
                    {{ $t('auth_terms_one') }} <a target="_blank" :href="ogrWebUrl + '/nutzungsbedingungen'">{{ $t('auth_terms_use') }}</a> {{ $t('auth_terms_two') }} <a target="_blank" :href="ogrWebUrl + '/datenschutz'">{{ $t('auth_terms_data') }}</a> {{ $t('auth_terms_three') }}
                  </v-row>
                </v-form>
                <v-card-actions>
                  <v-btn
                    @click="step = 1"
                  >
                    zurück
                  </v-btn>
                  <v-spacer/>
                  <v-btn
                    color="primary"
                    :disabled="!isQuestionFormValid || !seriesTagIsUnique"
                    @click="step = 3"
                  >
                    weiter
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card>
                <v-card-title class="pl-0">
                  <v-icon
                    large
                    left
                  >
                    mdi-text-box-check-outline
                  </v-icon>
                  <span class="text-h5 font-weight-light">Zusammenfassung</span>
                </v-card-title>

                <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Konfiguration der Serie:</span></v-card-text>
                <ogr-series-info-item title="Name der Serie: "><span>{{ series.name }}</span></ogr-series-info-item>
                <ogr-series-info-item title="Tag der Serie: "><span>{{ 's_' + series.tag }}</span></ogr-series-info-item>
                <ogr-series-info-item title="Serie geöffnet bis: "><span>{{ date }}</span></ogr-series-info-item>
                <ogr-series-info-item title="Serienelemente verstecken: "><span>{{ series.exam ? 'Ja' : 'Nein' }}</span></ogr-series-info-item>

                <v-card-text class="pl-0 mb-0"><span class="text-lg-subtitle-1">Fragestellung zur Serie:</span></v-card-text>
                <ogr-series-info-item title="Position auf der Karte: ">
                  <ogr-map-mini
                    v-if="step === 3"
                    :map.sync="map"
                    :marker-coords.sync="markerCoords"
                  />
                </ogr-series-info-item>
                <ogr-series-info-item title="Frage zur Serie: "><span>{{ question.question }}</span></ogr-series-info-item>
                <ogr-series-info-item title="Beschreibung der Serie: "><span>{{ question.description }}</span></ogr-series-info-item>
                <ogr-series-info-item title="Kategorie der Serie: "><span>{{ question.category }}</span></ogr-series-info-item>
                <ogr-series-info-item title="Tags zur Serie: ">
                  <v-chip
                    v-for="tag in question.tags"
                    :key="tag"
                    small
                    class="mr-1"
                  >
                    {{ tag }}
                  </v-chip>
                </ogr-series-info-item>

                <v-card-actions>
                  <v-btn
                    @click="step = 2"
                  >
                    zurück
                  </v-btn>
                  <v-spacer/>
                  <v-btn
                    class="mt-2"
                    :loading="loading"
                    :disabled="!(isQuestionFormValid && isSeriesFormValid)"
                    color="secondary"
                    @click="addSeries"
                  >
                    Serie erstellen
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-alert
                  class="pa-0"
                  outlined
                  color="primary"
              >
                <v-card-title>
                  <v-spacer />
                  <v-icon
                      large
                      left
                  >
                    mdi-party-popper
                  </v-icon>
                  <span class="text-h5 font-weight-light">Super! Deine Serie ist jetzt online!</span>
                  <v-spacer />
                </v-card-title>
                <v-card-text align="center">
                  Ab sofort können interessierte Geoforscher*Innen Hinweise und Beobachtungen zu deiner Serie beitragen.
                </v-card-text>
                <v-card-text align="center">
                  <qrcode-vue
                    :value="seriesLink"
                    :size="200"
                    level="H"
                    render-as="svg"
                    :foreground="'#1C6E00'"
                  />
                </v-card-text>
                <v-card-text align="center">
                  Mit diesem QR-Code können interessierte Geoforscher*Innen dem Serien-Event in der App beitreten.
                </v-card-text>
                <v-card-text align="center">
                  Sollte der QR-Code nicht funktionieren kann der Serie auch unter "Alle Serien" in der App beigetreten werden.
                </v-card-text>
              </v-alert>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <ogr-dialog-loading
      :show="loading"
      :success="loaded === true"
      :error="loaded === false"
      description="Einen Moment bitte. Die Serie wird gerade erstellt."
      :success-message="successMessage"
      :error-message="errorMessage"
    ></ogr-dialog-loading>

    <ogr-info-snackbar
      :show="snackbar"
      :message="message"
      @close-manual="snackbar = false"
      @close-auto="snackbar = false"
    />
  </v-container>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { v4 as uuidv4 } from 'uuid'
import { createQuestion, createFormData } from '@/util/url-utils'
import OgrDialogLoading from '../../dialog/OgrDialogLoading'
import OgrInputClassification from '../../input/OgrInputClassification'
import OgrInputTags from '../../input/OgrInputTags'
import OgrInputImage from '../../input/OgrInputImage'
import OgrSeriesInfoItem from './item/OgrSeriesInfoItem'
import OgrInfoSnackbar from './item/OgrInfoSnackbar'
import OgrMapMini from './item/OgrMapMini'
import OgrMapDialog from './item/OgrMapDialog'
import OgrMapList from './item/OgrMapList'

export default {
  name: 'ogrSeriesDashboardNewSeries',
  components: { OgrMapList, OgrMapDialog, OgrMapMini, OgrInfoSnackbar, OgrSeriesInfoItem, OgrInputImage, OgrInputTags, OgrInputClassification, OgrDialogLoading, QrcodeVue },
  data () {
    return {
      ogrWebUrl: this.$config.ogrHpUrl,
      ogrPwaUrl: this.$config.ogrPwaUrl,
      step: 1,
      questions: [],
      isSeriesFormValid: false,
      isQuestionFormValid: false,
      loading: false,
      loaded: undefined,
      checkbox: false,
      rules: {
        required: (value) => {
          return !!value || this.$t('auth_rule_mandatory')
        },
        maxLength: len => v => (v || '').length <= len || this.$t('input_text_length_max', [len]),
        minLength: len => v => (v || '').length >= len || this.$t('input_text_length_min', [len]),
        tag: (value) => {
          const pattern = /^[a-zA-Z0-9_]*$/
          return pattern.test(value) || this.$t('auth_rule_tag')
        }
      },
      menu: false,
      series: {
        name: undefined,
        tag: undefined,
        end: undefined,
        questionId: undefined,
        exam: false
      },
      seriesTagIsUnique: false,
      seriesTagChecked: false,
      question: {
        question: '',
        description: '',
        category: undefined,
        tags: [],
        media: {
          images: []
        }
      },
      files: {
        images: [],
        audios: [],
        videos: []
      },
      date: undefined,
      successMessage: 'Die Serie wurde erfolgreich erstellt.',
      errorMessage: 'Es ist ein Fehler aufgetreten. Die Serie konnte nicht angelegt werden.',
      snackbar: false,
      message: '',
      map: {
        center: [9.8123488, 51.3684384],
        zoom: 3,
        rotation: 0
      },
      markerCoords: [9.8123488, 51.3684384],
      manCoords: [0, 0],
      resetCoords: [0, 0],
      lastAccuracy: 0,
      geolocationOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      },
      navigatorId: undefined,
      manualGeoLocation: false,
      dialog: {
        location: false
      },
      seriesLink: ''
    }
  },

  methods: {
    isDateInTheFuture (val) {
      return Date.now() - 24 * 60 * 60 * 1000 <= Date.parse(val)
    },
    cancelPositionDialog () {
      this.markerCoords = this.resetCoords
      this.map.center = this.resetCoords
      this.dialog.location = false
    },
    openPositionDialog () {
      this.resetCoords = this.markerCoords
      this.dialog.location = true
    },
    submitMarkerPosition () {
      this.markerCoords = this.map.center
      this.dialog.location = false
    },
    updateImages (input) {
      this.question.media.images = input.names
      this.files.images = input.files
    },
    checkSeriesTag () {
      this.$axios.get('/ogr/tags?query=' + 's_' + this.series.tag)
        .then((response) => {
          this.seriesTagChecked = true
          this.seriesTagIsUnique = response.data.length <= 0
        })
    },
    showSnackbar (message) {
      this.snackbar = false
      this.message = message
      this.snackbar = true
    },
    checkQuestion (input) {
      if (input.question === '') {
        this.showSnackbar(this.$t('alert_input_question'))
        return false
      }
      if (this.markerCoords[0] === 9.8123488 && this.markerCoords[1] === 51.3684384) {
        this.showSnackbar(this.$t('alert_input_location'))
        return false
      }
      if (input.question.length > 200) {
        this.showSnackbar(this.$t('alert_input_question_too_long'))
        return false
      }
      if (input.question.length > 4000) {
        this.showSnackbar(this.$t('alert_input_description_too_long'))
        return false
      }

      return true
    },
    validateQuestion () {
      if (this.question.tags === null) {
        this.question.tags = 0
      }
    },
    createConfig (type) {
      if (this.$auth.getToken('local')) {
        return { headers: { 'Content-Type': type, Authorization: this.$auth.getToken('local') } }
      } else {
        return { headers: { 'Content-Type': type } }
      }
    },
    async addSeries () {
      this.loaded = undefined
      const questionUUID = uuidv4()
      let uploadUrl = null
      try {
        if (this.checkQuestion(this.question)) {
          this.loading = true
          this.validateQuestion()
          const uploadQuestionResponse = await this.uploadQuestion(questionUUID)
          if (uploadQuestionResponse) {
            uploadUrl = uploadQuestionResponse.data.uploadUrl
            const uploadFilesResponse = await this.uploadFiles(uploadUrl)
            if (uploadQuestionResponse && uploadFilesResponse) {
              const uploadSeriesResponse = this.uploadSeries(uploadQuestionResponse.data.id)
              if (uploadSeriesResponse) {
                setTimeout(() => (this.loaded = true), 1500)
                setTimeout(() => (this.step = 4), 2500)
                setTimeout(() => (this.loading = false), 3000)
              }
            }
          }
        }
      } catch (err) {
        this.errorMessage += ' Fehler: ' + err.response.data.message
        setTimeout(() => (this.loaded = false), 1500)
        setTimeout(() => (this.loading = false), 10000)
      }
    },
    uploadQuestion (questionUUID) {
      const thingUUID = uuidv4()
      const request = createQuestion(this.question, this.markerCoords, questionUUID, thingUUID, false, true)
      const config = this.createConfig('application/json')
      return new Promise(function (resolve, reject) {
        window.$nuxt.$axios.post('/ogr/question', request, config)
          .then((response) => {
            if (response.status === 200) {
              return resolve(response)
            }
            return reject(Error('Request failed with status code: ' + response.status))
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    uploadFiles (uploadUrl) {
      if (this.files.images.length > 0 || this.files.audios.length > 0 || this.files.videos.length > 0) {
        const formData = createFormData(this.files)
        const config = this.createConfig('multipart/form-data')
        return new Promise(function (resolve, reject) {
          window.$nuxt.$axios.post(uploadUrl, formData, config)
            .then((response) => {
              if (response.status === 200) {
                return resolve(response)
              }
              return reject(Error('Request failed with status code: ' + response.status))
            })
            .catch((err) => {
              return reject(err)
            })
        })
      } else {
        return true
      }
    },
    uploadSeries (questionId) {
      this.series.end = this.date + 'T23:59:59.000Z'
      this.series.tag = 's_' + this.series.tag
      this.seriesLink = this.ogrPwaUrl + '/join/' + this.series.tag
      this.series.questionId = questionId
      const request = this.series
      return new Promise(function (resolve, reject) {
        window.$nuxt.$axios.post('/ogr/question_series', request)
          .then((response) => {
            if (response.status === 200) {
              return resolve(response)
            }
            return reject(Error('Request failed with status code: ' + response.status))
          })
          .catch((err) => {
            return reject(err)
          })
      })
    }
  }
}
</script>

<style scoped>
::v-deep .vue-treeselect {
  position: relative;
  text-align: left;
  font-size: 16px;
  letter-spacing: normal;
}

/* #### Search container #### */
::v-deep .vue-treeselect__control {
  border: 2px solid #358706;
  border-bottom: 2px solid #e9e9e9;
}

/* Text Eingabe */
::v-deep .vue-treeselect--has-value .vue-treeselect__input {
  line-height: inherit;
  vertical-align: middle;
}
::v-deep .vue-treeselect__input {
  min-height: 40px;
}

/* Text Auswahl */
::v-deep .vue-treeselect__single-value {
  vertical-align: middle;
  font-size: 16px;
  padding-top: 2px;
}
/* Text Placeholder */
::v-deep .vue-treeselect__placeholder {
  color: rgba(0, 0, 0, 0.6);
  padding-top: 2px;
  font-size: 16px;
  font-weight: 100;
}

/* #### Select container #### */
::v-deep .vue-treeselect__menu {
  border-left: 2px solid #358706;
  border-right: 2px solid #358706;
  border-bottom: 2px solid #358706;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0 solid #e9e9e9;
}

/* aktives Element (Auswahl) */
::v-deep .vue-treeselect--single .vue-treeselect__option--selected {
  background: #e7f1df;
  font-weight: 500;
  color: #358706;
}
/* Listenelement (alle) */
::v-deep .vue-treeselect__indent-level-1 .vue-treeselect__option {
  padding-bottom: 3px;
  padding-top: 3px;
}

::v-deep .v-select__selections {
  text-transform: none;
}
</style>
