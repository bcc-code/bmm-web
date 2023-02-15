import { createAuth0 } from '@auth0/auth0-vue'
import config from '~/config.json'
import { type UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  if (config.auth0) {
    app.use(
      createAuth0({
        domain: config.auth0.domain,
        client_id: config.auth0.client_id,
        redirect_uri: window.location.origin,
        cacheLocation: 'localstorage',
        audience: config.auth0.audience,
        useRefreshTokens: true,
        scope: 'church',
      }),
    )
  }
}
