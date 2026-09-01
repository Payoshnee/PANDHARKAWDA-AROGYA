import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function POST() {
  const cookieHeader = (await cookies()).toString();
  const upstream = await fetch(`${baseUrl}/api/v1/admin/auth/logout`, {
    method: "POST",
    headers: { cookie: cookieHeader },
    cache: "no-store"
  });
  const payload = await upstream.json();
  const response = NextResponse.json(payload, { status: upstream.status });
  response.cookies.delete("arogya_admin");
  return response;
}
