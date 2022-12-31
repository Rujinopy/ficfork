import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import FacebookProvider from "next-auth/providers/facebook";
import prisma from "../../../lib/prismadb"
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt-ts";
import session from "../session/session";
import { Session } from "inspector";
import { JWT } from "next-auth/jwt";

export const authOptions:NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    // ...add more providers here
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text"},
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials, req) => {
        // Add logic here to look up the user from the credentials supplied
        //check if user exists
        const res = await fetch("http://localhost:3000/api/auth/check-credential", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(credentials)
        })

        const user = await res.json()
        
        
        if (res.ok && user) {
          // Any object returned will be saved in `user` property of the JWT
          console.log(user);
          return user
        }
        else {
          return null
        }
      }   
    })
  ],
  secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=",
  session: {
    strategy: "jwt",
    maxAge: 3000,
 }
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
  // callbacks: {
  //   async session(session: Session, token: JWT) {
  //     if(token.user != null){
  //       session = token.user
  //       return true
  //     }
      
  //   },
  // }
}
export default NextAuth(authOptions)
