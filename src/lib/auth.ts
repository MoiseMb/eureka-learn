import { prisma } from "@/lib/prisma"
import { compare, hash } from "bcrypt"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export async function hashPassword(password: string) {
    return await hash(password, 12)
}

export const authOptions: NextAuthOptions = {
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email et mot de passe requis")
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                })

                if (!user) {
                    throw new Error("Utilisateur non trouvé")
                }

                const isValid = await compare(credentials.password, user.password)

                if (!isValid) {
                    throw new Error("Mot de passe incorrect")
                }
                let departmentId = '';
                let departmentName = '';
                if (user.role === "ADMIN_DPT") {
                    departmentId = await prisma.department.findFirst
                        ({
                            where: {
                                managerId: user.id
                            },
                            select: {
                                id: true
                            }
                        }).then(department => department?.id || '');
                }

                if (user.role === "USER" || user.departmentId) {
                    departmentName = await prisma.department.findUnique
                        ({
                            where: {
                                id: user.departmentId?.toString()
                            },
                            select: {
                                name: true
                            }
                        }).then(department => department?.name || '');
                }

                return {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    role: user.role,
                    departmentId: departmentId,
                    departmentName: departmentName
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.role = user.role
                token.departmentId = user.departmentId
                token.departmentName = user.departmentName
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.firstName = token.firstName as string
                session.user.lastName = token.lastName as string
                session.user.role = token.role as string
                session.user.departmentId = token.departmentId as string
                session.user.departmentName = token.departmentName as string
            }
            return session
        }
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            firstName: string
            lastName: string
            role: string
            departmentId: string | null
            departmentName: string | null
        }
    }
    interface User {
        id: string
        firstName: string
        lastName: string
        role: string
        departmentId: string | null
        departmentName: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        firstName: string
        lastName: string
        role: string
        departmentId: string | null

    }
}