/**
 * Until reactive storage keys are supported, I copied
 * the source code from the VueUse repo and
 * modified for our use case.
 *
 * Originally written by Anthony Fu
 * https://github.com/vueuse/vueuse/blob/main/packages/core/useStorage/index.ts
 */

import { defaultWindow, getSSRHandler } from "@vueuse/core";
import type { ConfigurableWindow, StorageLike } from "@vueuse/core";
import type {
  Awaitable,
  ConfigurableEventFilter,
  ConfigurableFlush,
  MaybeRefOrGetter,
  RemovableRef,
} from "@vueuse/shared";

export interface Serializer<T> {
  read: (raw: string) => T;
  write: (value: T) => string;
}

export interface SerializerAsync<T> {
  read: (raw: string) => Awaitable<T>;
  write: (value: T) => Awaitable<string>;
}

export const StorageSerializers: Record<
  "boolean" | "object" | "number" | "any" | "string" | "map" | "set" | "date",
  Serializer<any>
> = {
  boolean: {
    read: (v: any) => v === "true",
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) =>
      JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
};

export const customStorageEventName = "vueuse-storage";

function guessSerializerType<
  T extends string | number | boolean | object | null,
>(rawInit: T) {
  if (rawInit == null) return "any";
  if (rawInit instanceof Set) return "set";
  if (rawInit instanceof Map) return "map";
  if (rawInit instanceof Date) return "date";
  if (typeof rawInit === "boolean") return "boolean";
  if (typeof rawInit === "string") return "string";
  if (typeof rawInit === "object") return "object";
  if (!Number.isNaN(rawInit)) return "number";
  return "any";
}

export interface StorageEventLike {
  storageArea: StorageLike | null;
  key: StorageEvent["key"];
  oldValue: StorageEvent["oldValue"];
  newValue: StorageEvent["newValue"];
}

export interface UseStorageOptions<T>
  extends ConfigurableEventFilter,
    ConfigurableWindow,
    ConfigurableFlush {
  /**
   * Watch for deep changes
   *
   * @default true
   */
  deep?: boolean;

  /**
   * Listen to storage changes, useful for multiple tabs application
   *
   * @default true
   */
  listenToStorageChanges?: boolean;

  /**
   * Write the default value to the storage when it does not exist
   *
   * @default true
   */
  writeDefaults?: boolean;

  /**
   * Merge the default value with the value read from the storage.
   *
   * When setting it to true, it will perform a **shallow merge** for objects.
   * You can pass a function to perform custom merge (e.g. deep merge), for example:
   *
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T);

  /**
   * Custom data serialization
   */
  serializer?: Serializer<T>;

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void;

  /**
   * Use shallow ref as reference
   *
   * @default false
   */
  shallow?: boolean;

  /**
   * Wait for the component to be mounted before reading the storage.
   *
   * @default false
   */
  initOnMounted?: boolean;
}

export function useReactiveStorage(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<string>,
  storage?: StorageLike,
  options?: UseStorageOptions<string>,
): RemovableRef<string>;
export function useReactiveStorage(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<boolean>,
  storage?: StorageLike,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>;
export function useReactiveStorage(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<number>,
  storage?: StorageLike,
  options?: UseStorageOptions<number>,
): RemovableRef<number>;
export function useReactiveStorage<T>(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<T>,
  storage?: StorageLike,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;
export function useReactiveStorage<T = unknown>(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<null>,
  storage?: StorageLike,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;

/**
 * Reactive LocalStorage/SessionStorage.
 *
 * @see https://vueuse.org/useStorage
 */
export function useReactiveStorage<
  T extends string | number | boolean | object | null,
>(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<T>,
  storage: StorageLike | undefined,
  options: UseStorageOptions<T> = {},
): RemovableRef<T> {
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    },
    initOnMounted,
  } = options;

  const data: RemovableRef<T> = (shallow ? shallowRef : ref)(
    typeof defaults === "function" ? defaults() : defaults,
  );

  if (!storage) {
    try {
      // eslint-disable-next-line no-param-reassign
      storage = getSSRHandler(
        "getDefaultStorage",
        () => defaultWindow?.localStorage,
      )();
    } catch (e) {
      onError(e);
    }
  }

  if (!storage) return data;

  const rawInit: T = toValue(defaults);
  const type = guessSerializerType<T>(rawInit);
  const serializer = options.serializer ?? StorageSerializers[type];

  function dispatchWriteEvent(
    oldValue: string | null,
    newValue: string | null,
  ) {
    // send custom event to communicate within same page
    if (window) {
      const payload: StorageEventLike = {
        key: toValue(key),
        oldValue,
        newValue,
        storageArea: storage ?? null,
      };
      // We also use a CustomEvent since StorageEvent cannot
      // be constructed with a non-built-in storage area
      window.dispatchEvent(
        storage instanceof Storage && payload instanceof StorageEvent
          ? new StorageEvent("storage", payload)
          : new CustomEvent<StorageEventLike>(customStorageEventName, {
              detail: payload,
            }),
      );
    }
  }

  function write(v: unknown) {
    try {
      const oldValue = storage!.getItem(toValue(key));

      if (v == null) {
        dispatchWriteEvent(oldValue, null);
        storage!.removeItem(toValue(key));
      } else {
        const serialized = serializer.write(v as any);
        if (oldValue !== serialized) {
          storage!.setItem(toValue(key), serialized);
          dispatchWriteEvent(oldValue, serialized);
        }
      }
    } catch (e) {
      onError(e);
    }
  }

  function read(event?: StorageEventLike) {
    const rawValue = event ? event.newValue : storage!.getItem(toValue(key));

    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        storage!.setItem(toValue(key), serializer.write(rawInit));
      return rawInit;
    }
    if (!event && mergeDefaults) {
      const value = serializer.read(rawValue);
      if (typeof mergeDefaults === "function")
        return mergeDefaults(value, rawInit);
      if (type === "object" && !Array.isArray(value))
        return { ...(rawInit as any), ...value };
      return value;
    }
    if (typeof rawValue !== "string") {
      return rawValue;
    }
    return serializer.read(rawValue);
  }

  const { pause: pauseWatch, resume: resumeWatch } = pausableWatch(
    data,
    () => write(data.value),
    { flush, deep, eventFilter },
  );

  function update(event?: StorageEventLike) {
    if (event && event.storageArea !== storage) return;

    if (event && event.key == null) {
      data.value = rawInit;
      return;
    }

    if (event && event.key !== key) return;

    pauseWatch();
    try {
      if (event?.newValue !== serializer.write(data.value))
        data.value = read(event);
    } catch (e) {
      onError(e);
    } finally {
      // use nextTick to avoid infinite loop
      if (event) nextTick(resumeWatch);
      else resumeWatch();
    }
  }

  function updateFromCustomEvent(event: CustomEvent<StorageEventLike>) {
    update(event.detail);
  }

  watch(
    () => toValue(key),
    () => {
      data.value = read();
    },
  );

  if (window && listenToStorageChanges) {
    tryOnMounted(() => {
      /**
       * Attaching event listeners here should be fine since we are in a mounted hook
       *
       * The custom event is needed for same-document syncing when using custom
       * storage backends, but it doesn't work across different documents.
       *
       * TODO: Consider implementing a BroadcastChannel-based solution that fixes this.
       */
      if (storage instanceof Storage)
        useEventListener(window, "storage", update);
      else
        useEventListener(window, customStorageEventName, updateFromCustomEvent);

      if (initOnMounted) update();
    });
  }

  // avoid reading immediately to avoid hydration mismatch when doing SSR
  if (!initOnMounted) update();

  return data;
}