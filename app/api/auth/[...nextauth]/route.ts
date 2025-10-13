import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import UserModel from "../../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();
        if (!credentials) return null;
        const userDoc = await UserModel.findOne({ email: credentials.email });
        if (!userDoc) return null;
        const user = userDoc.toObject ? userDoc.toObject() : userDoc;
        const match = await bcrypt.compare(credentials.password, (user as any).password || "");
        if (!match) return null;
        // return user object - NextAuth will store it in session
        return { id: String((user as any)._id), name: (user as any).name, email: (user as any).email, role: (user as any).role } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        (token as any).userId = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.role = token.role;
      (session as any).user.id = (token as any).userId ?? (token as any).sub;
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirecting to:", url, "baseUrl: ", baseUrl);
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
});

export { handler as GET, handler as POST };
