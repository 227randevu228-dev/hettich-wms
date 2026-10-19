import type { NextAuthConfig } from "next-auth"

export default {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request }) {
      const isDashboard = request.nextUrl.pathname.startsWith("/dashboard")
      if (isDashboard && !auth) return false
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
