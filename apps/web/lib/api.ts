import { clientEnv } from "./env";

const baseUrl = clientEnv.NEXT_PUBLIC_API_BASE_URL;

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json() as Promise<T>;
}

export type Doctor = { id: string; slug: string; name_en: string; name_mr: string; qualification: string; specialty: string; doctor_type: string; phone_public: string | null; last_verified_at: string | null };
export type Facility = { id: string; slug: string; type: string; name_en: string; name_mr: string; address_en: string; address_mr: string; phone_public: string | null; emergency_flag: boolean; services: string[]; latitude: number | null; longitude: number | null; last_verified_at: string | null };
export type ContentRecord = { id: string; slug: string; title_en: string; title_mr: string; summary_en: string; summary_mr: string; source: string; review_date: string };
