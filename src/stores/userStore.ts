import { useAuth0 } from '@auth0/auth0-vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { PiniaPersistedStateOptions } from '~/utils/data'

export const useUserStore = defineStore('user', () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

  const isCookieAccepted = ref(false)
  const cookiePopupVisible = ref(true)

  const isUserAuthenticated = computed(() => {
    return isAuthenticated.value
  })
  const currentUser = computed(() => {
    return user.value
  })

  const handleLogin = () => {
    loginWithRedirect({ appState: { targetUrl: '/' } })
  }

  const handleLogout = () => {
    logout({ returnTo: window.location.origin })
  }

  const acceptDeclineCookie = (value: boolean) => {
    isCookieAccepted.value = value
    cookiePopupVisible.value = false
  }

  return {
    isUserAuthenticated,
    currentUser,
    isCookieAccepted,
    cookiePopupVisible,

    handleLogin,
    handleLogout,
    acceptDeclineCookie,
  }
},
{
  persist: PiniaPersistedStateOptions,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
