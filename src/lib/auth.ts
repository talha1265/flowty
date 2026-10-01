import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { authService } from './auth-service';
import { UserRole } from './types';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'flowty_super_secure_jwt_random_secret_string_32chars_min',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/login',
    newUser: '/signup'
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const user = await authService.verifyPassword(
          credentials.email,
          credentials.password
        );

        if (!user) {
          throw new Error('Invalid email or password. Please verify your credentials.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
          role: user.role
        };
      }
    }),

    // Google Provider - connects directly when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const email = user.email || '';
          const name = user.name || profile?.name || 'Google User';
          const avatarUrl = user.image || undefined;
          const googleId = account.providerAccountId;

          // Authenticate or link in authService
          const dbUser = await authService.authenticateWithGoogle({
            googleId,
            email,
            name,
            avatarUrl,
            accountType: 'BRAND' // default to Brand if direct Google login without onboarding
          });

          // Attach role to user object for jwt callback
          (user as any).role = dbUser.role;
          (user as any).id = dbUser.id;
          return true;
        } catch (error) {
          console.error('[NextAuth] Google sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.avatarUrl = user.image;
      }
      if (trigger === 'update' && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as UserRole) || 'BRAND';
        if (token.avatarUrl) {
          session.user.image = token.avatarUrl as string;
        }
      }
      return session;
    }
  }
};
