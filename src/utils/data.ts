import type { PersistedStateOptions, Serializer } from 'pinia-plugin-persistedstate'
import Guid from './Guid'

/* Constants */
export const OBJECT = '[object Object]'
export const ARRAY = '[object Array]'
export const DATE = '[object Date]'
export const FUNCTION = '[object Function]'
export const BOOLEAN = '[object Boolean]'
export const NUMBER = '[object Number]'
export const STRING = '[object String]'
export const NULL = '[object Null]'
export const UNDEFINED = '[object Undefined]'
export const SYMBOL = '[object Symbol]'

export const PiniaPersistedStateOptions = {
    enabled: true,
    serializer: {
      serialize: stringify,
      deserialize: parse,
    } as Serializer,
  } as PersistedStateOptions

  export function stringify(data: any): string {
    return JSON.stringify(data, dataSerializer)
  }
  export function parse(data: any): any {
    return JSON.parse(data, dataDeserializer)
  }

  export function dataDeserializer(key: string, value: any) {
  if (key) {
    if (value && Guid.isGuid(value))
      return Guid.parse(value)
  }

  return value
}

  export function dataSerializer(key: string, value: any) {
    if (key) {
      if (value && isDate(value))
        return value.toUTCString()
      if (value && Guid.isGuid(value))
        return value.value.toString()
    }
    return value
  }

  export const isDate = (obj: any): boolean => {
    return Object.prototype.toString.call(obj) === DATE
  }