import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role: string }).role
      return token
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdmin = (auth?.user as { role?: string })?.role === 'ADMIN'
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnAdminLogin = nextUrl.pathname === '/admin/login'

      if (isOnAdmin && !isOnAdminLogin) {
        if (!isLoggedIn || !isAdmin) return false
        return true
      }
      return true
    },
  },
  providers: [],
  session: { strategy: 'jwt' },
}
