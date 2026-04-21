import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute    = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isApiRoute        = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // API routes — just protect, no redirects
  if (isApiRoute(req)) {
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  // مسجّل + public route → dashboard
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // مسجّل + ليس public + ليس onboarding
  if (userId && !isPublicRoute(req) && !isOnboardingRoute(req)) {
    // إذا لم يكمل onboarding → أرسله لـ onboarding
    const onboardingComplete =
      (sessionClaims?.metadata as Record<string, unknown> | undefined)?.onboardingComplete;
    if (!onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  // غير مسجّل + protected route → sign-in
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
