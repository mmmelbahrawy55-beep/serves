import { toast } from "sonner";

interface CacheEntry {
  data: any;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 15_000; // 15 seconds

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiry) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any, ttl: number = DEFAULT_TTL) {
  cache.set(key, { data, expiry: Date.now() + ttl });
}

export async function apiGet<T = any>(url: string, options?: { ttl?: number }): Promise<T> {
  const cached = getCached(url);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error("فشل تحميل البيانات");
  const data = await res.json();
  setCache(url, data, options?.ttl);
  return data;
}

export async function apiPost<T = any>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "فشل في العملية" }));
    throw new Error(err.error || "فشل في العملية");
  }
  return res.json();
}

export async function apiPatch<T = any>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "فشل في العملية" }));
    throw new Error(err.error || "فشل في العملية");
  }
  return res.json();
}

export async function apiDelete<T = any>(url: string, body?: any): Promise<T> {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "فشل في العملية" }));
    throw new Error(err.error || "فشل في العملية");
  }
  return res.json();
}

export function withToast<T>(promise: Promise<T>, successMsg: string): Promise<T> {
  return promise.then((res) => {
    toast.success(successMsg);
    return res;
  }).catch((err) => {
    toast.error(err.message);
    throw err;
  });
}