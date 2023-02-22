import { useAuth0 } from '@auth0/auth0-vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { PiniaPersistedStateOptions } from '../../src/utils/data'

export const useUserStore = defineStore('user', () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

  const isUserAuthenticated = computed(() => {
    return isAuthenticated.value
  })
  const currentUser = computed(() => {
    return user.value
  })

  const handleLogin = () => {
    loginWithRedirect({ appState: { targetUrl: '/login' } })
  }

  const handleLogout = () => {
    logout({ returnTo: window.location.origin })
  }
  return {
    isUserAuthenticated,
    currentUser,

    handleLogin,
    handleLogout,
  }
},
{
  persist: PiniaPersistedStateOptions,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
