import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

if (process.env.NODE === 'production') {
  Sentry.init({
    dsn: 'https://797db1a5c83744e38102da7413d41fdf@sentry.io/1885394',
    integrations: [new Integrations.Vue({Vue, attachProps: true})],
  })
}
