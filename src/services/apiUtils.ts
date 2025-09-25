/**
 * Small utilities for building URL query strings and normalizing request payloads.
 * - buildQuery: turns a params object into a URL encoded query string
 * - buildUrl: appends query string to a base URL
 * - normalizePayload: removes undefined values and converts Dates to ISO strings
 */

export type QueryParamPrimitive =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;
export type QueryParams = {
  [key: string]:
    | QueryParamPrimitive
    | QueryParamPrimitive[]
    | Record<string, unknown>;
};

export function buildQuery(params: QueryParams | undefined): string {
  if (!params) return "";
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, rawValue]) => {
    if (rawValue === null) {
      // explicit null -> include empty value
      search.append(key, "");
      return;
    }
    if (!rawValue) return; // skip

    // arrays -> append each
    if (Array.isArray(rawValue)) {
      rawValue.forEach((v) => {
        if (!v && v !== null) return;
        if (v === null) {
          search.append(key, "");
        } else if (v instanceof Date) {
          search.append(key, v.toISOString());
        } else {
          search.append(key, String(v));
        }
      });
      return;
    }

    // Date -> ISO
    if (rawValue instanceof Date) {
      search.append(key, rawValue.toISOString());
      return;
    }

    // plain object -> JSON
    if (typeof rawValue === "object") {
      try {
        search.append(key, JSON.stringify(rawValue));
      } catch {
        // fallback to string conversion
        search.append(key, String(rawValue));
      }
      return;
    }

    // primitive
    search.append(key, String(rawValue));
  });

  return search.toString();
}

export function buildUrl(base: string, params?: QueryParams): string {
  const q = buildQuery(params);
  if (!q) return base;
  // If base already contains ? assume it's a path with existing query
  return base + (base.includes("?") ? "&" : "?") + q;
}

export function normalizePayload<T = unknown>(payload: T): T {
  if (payload === null || payload === undefined) return payload;

  if (payload instanceof Date) return payload.toISOString() as unknown as T;

  if (Array.isArray(payload)) {
    return payload.map((p) => normalizePayload(p)) as unknown as T;
  }

  if (typeof payload === "object") {
    const out: Record<string, unknown> = {};
    Object.entries(payload as Record<string, unknown>).forEach(([k, v]) => {
      if (v === undefined) return; // drop undefined
      if (v === null) {
        out[k] = null; // keep explicit nulls
        return;
      }
      if (v instanceof Date) {
        out[k] = v.toISOString();
        return;
      }
      if (Array.isArray(v)) {
        out[k] = v.map((i) => normalizePayload(i));
        return;
      }
      if (typeof v === "object") {
        out[k] = normalizePayload(v as unknown) as unknown;
        return;
      }
      out[k] = v as unknown;
    });
    return out as unknown as T;
  }

  return payload;
}

export default {
  buildQuery,
  buildUrl,
  normalizePayload,
};

export function getErrorMessage(err: unknown, fallback = "An error occurred") {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    const asAny = err as { response?: { data?: { message?: string } } };
    return asAny.response?.data?.message || JSON.stringify(err) || fallback;
  } catch {
    return fallback;
  }
}
