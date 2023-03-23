import Store from "@/store";
import { inject } from "vue";

export default function useStore() {
  const store: Store = inject("store")!;
  return {
    store,
    state: store.getState(),
  };
}
