import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
          include: { image: true },
        });

        if (!user) throw new Error('User not found');
        if (!credentials?.password || !user.password) throw new Error('Password is empty');

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error('Invalid password');

        // ✅ Only return plain JSON-safe values
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image?.url ?? null,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as string,
        email: token.email as string,
        name: token.name as string,
        image: token.picture as string | null,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // ✅ correctly placed here
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
