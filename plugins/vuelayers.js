import Vue from 'vue'
import VueLayers from 'vuelayers'
// import 'vuelayers/lib/style.css' // needs css-loader
import { findPointOnSurface } from 'vuelayers/dist/ol-ext'

Vue.use(VueLayers)

Vue.prototype.$findPointOnSurface = (geom) => {
  return findPointOnSurface(geom)
}
