import type { AsyncData } from "#app";
import { CurrentUserApi } from "@bcc-code/bmm-sdk-fetch";
import type { UserModel } from "@bcc-code/bmm-sdk-fetch";

let cachedComposable: AsyncData<UserModel, Error | null> | null = null;
export function useCurrentUser(): AsyncData<UserModel, Error | null> {
  cachedComposable ??= useAsyncData(`current-user-asyncdata`, () =>
    new CurrentUserApi().currentUserGet(), { dedupe: 'defer', }
  );
  return cachedComposable!;
}
