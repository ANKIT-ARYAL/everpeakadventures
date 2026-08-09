import type { NextRequest } from "next/server";
import { GET, POST as nextAuthPOST } from "@/auth";
import { rateLimit } from "@/app/lib/rate-limit";

export { GET };

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ nextauth: string[] }> }
) {
  const segments = (await ctx.params).nextauth;
  const isCredentialsCallback =
    segments?.length === 2 &&
    segments[0] === "callback" &&
    segments[1] === "credentials";

  if (isCredentialsCallback) {
    const limited = await rateLimit(request, {
      windowMs: 10 * 60 * 1000,
      max: 10,
      keyPrefix: "login",
    });
    if (limited) return limited;
  }

  return nextAuthPOST(request, ctx);
}