import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        if (!res.ok) {
          return null;
        }

        const data = await res.json();

        if (!data.access_token) {
          return null;
        }

        return {
          id: credentials.email,
          email: credentials.email,
          accessToken: data.access_token
        };
      }
    })
  ],

  callbacks: {
    async jwt({
      token,
      user
    }: {
      token: JWT & { accessToken?: string };
      user?: User & { accessToken?: string };
    }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({
      session,
      token
    }: {
      session: Session & { accessToken?: string };
      token: JWT & { accessToken?: string };
    }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },

  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
// force redeploy 
