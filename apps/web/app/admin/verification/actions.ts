"use server";

import { revalidatePath } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function decideVerificationItem(itemId: string, decision: "approve" | "reject") {
  await fetch(`${baseUrl}/api/v1/admin/verification/${itemId}/${decision}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      verifier: "demo-admin",
      reason: decision === "approve" ? "Reviewed in admin queue" : "Rejected in admin queue"
    }),
    cache: "no-store"
  });
  revalidatePath("/admin/verification");
  revalidatePath("/admin/audit-log");
}
