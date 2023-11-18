export const DATE = "[object Date]";

export const isDate = (obj: any): boolean =>
  Object.prototype.toString.call(obj) === DATE;

export function dataDeserializer(key: string, value: any) {
  if (key) {
    if (isDate(value)) return new Date(value);
  }

  return value;
}

export function dataSerializer(key: string, value: any) {
  if (key) {
    if (value instanceof Date) return value.toISOString();
  }

  return value;
}

export function stringify(data: any): string {
  return JSON.stringify(data, dataSerializer);
}
export function parse(data: any): any {
  return JSON.parse(data, dataDeserializer);
}

export const PiniaPersistedStateOptions = {
  storage: window.localStorage,
  enabled: true,
  serializer: {
    serialize: stringify,
    deserialize: parse,
  },
};
