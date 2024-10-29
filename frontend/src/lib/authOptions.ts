import  NextAuth  from "next-auth";
import dbConnect from "./dbconnect";

import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import GitHubProvider from "next-auth/providers/github";

export const {
  handlers: {GET, POST},
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({user}) {
      // Connect to the database
      await dbConnect();

      // Call our checkUser API to ensure the user is saved in the database
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/auth/checkUser`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
          }),
        }
      );

      if (res.ok) {
        return true; // Sign-in allowed
      }
      return false; // Sign-in denied
    },
  },
});