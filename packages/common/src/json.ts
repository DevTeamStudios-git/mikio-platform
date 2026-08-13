/**
 * JSON types shared across the API boundary (backend → SDK → clients).
 * Anything serialized over HTTP in this platform is one of these.
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];