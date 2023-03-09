import Store from "@/store"
import { inject } from "vue"

export default function useStore() {
  const store = inject('store') as Store
  return {
    store,
    state: store.getState(),
  }
}