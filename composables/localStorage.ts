/**
 * Until reactive storage keys are supported, I copied
 * the source code from the VueUse repo and
 * modified for our use case.
 *
 * Originally written by Anthony Fu
 * https://github.com/vueuse/vueuse/blob/main/packages/core/useLocalStorage/index.ts
 */

import { defaultWindow } from "@vueuse/core";
import type { MaybeRefOrGetter, RemovableRef } from "@vueuse/core";

export function useReactiveLocalStorage(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<string>,
  options?: UseStorageOptions<string>,
): RemovableRef<string>;
export function useReactiveLocalStorage(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<boolean>,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>;
export function useReactiveLocalStorage(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<number>,
  options?: UseStorageOptions<number>,
): RemovableRef<number>;
export function useReactiveLocalStorage<T>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;
export function useReactiveLocalStorage<T = unknown>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<null>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;

export function useReactiveLocalStorage<
  T extends string | number | boolean | object | null,
>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<any> {
  const { window = defaultWindow } = options;
  return useReactiveStorage(key, initialValue, window?.localStorage, options);
}
