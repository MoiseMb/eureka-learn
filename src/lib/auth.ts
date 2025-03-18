import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./axios";
import { Role } from "@/types";

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    accessToken: string;
}

interface AuthResponse {
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
    };
    accessToken: string;
}

declare module "next-auth" {
    interface User {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
        accessToken: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<any> {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const response = await api.post("/auth/login", {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const { user, accessToken } = response.data;

                    if (!user || !accessToken) {
                        return null;
                    }

                    return {
                        ...user,
                        accessToken
                    };
                } catch (error: any) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = Number(user.id);
                token.email = user.email;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                ...token
            };
            session.accessToken = token.accessToken;
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    }
};

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: Role;
        };
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
        accessToken: string;
    }
}