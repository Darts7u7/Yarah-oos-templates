import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/lib/auth-cookies";
import { getYarahServerClient } from "@/lib/yarah";

export async function POST(request: Request) {
  const yarah = getYarahServerClient();

  try {
    await yarah.auth.signOut();
  } catch {
    // Clear local cookies even if the upstream sign-out call fails.
  }

  await clearAuthCookies();
  return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}
