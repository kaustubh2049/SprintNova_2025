import { clerkMiddleware } from "@clerk/nextjs/server"

// Allow all routes - admin has its own authentication
export default clerkMiddleware()

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
