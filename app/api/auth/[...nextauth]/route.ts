import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";
import { authOptions } from "@/utils/authOptions";


const handler = (NextAuth as any)(authOptions);
export { handler as GET, handler as POST };