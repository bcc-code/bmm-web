import { CurrentUserApi } from "@bcc-code/bmm-sdk-fetch";

export function useCurrentUser() {
  return reactiveApi(
    useLazyAsyncData(`current-user`, () =>
      new CurrentUserApi().currentUserGet(),
    ),
  );
}
