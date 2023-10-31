// apollo.config.js
export default function ({ $config }) {
  return {
    httpEndpoint: $config.ogrApiUrl + '/ogr/graphql'
  }
}
