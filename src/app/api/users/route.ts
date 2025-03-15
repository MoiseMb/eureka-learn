
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN_DPT") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }


        if (session.user.departmentId === undefined) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas créer un utilisateur" },
                { status: 403 }
            );
        }

        const { firstName, lastName, email, password } = await request.json();

        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
            return NextResponse.json(
                { error: "Tous les champs sont requis" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Cet email est déjà utilisé" },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: "USER",
                departmentId: session.user.departmentId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return NextResponse.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création de l'utilisateur" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN_DPT") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";

        const users = await prisma.user.findMany({
            where: {
                role: "USER",
                departmentId: session.user.departmentId,
                OR: [
                    { firstName: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } }
                ]
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
            }
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Erreur lors du chargement des utilisateurs" },
            { status: 500 }
        );
    }
}