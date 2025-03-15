import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const { name, quantity, category, description, unitPrice } = await request.json();

        if (!name || !quantity || !category || !unitPrice) {
            return NextResponse.json(
                { error: "Tous les champs sont requis" },
                { status: 400 }
            );
        }

        const totalAmount = quantity * unitPrice;

        const newRequest = await prisma.request.create({
            data: {
                name,
                quantity,
                category,
                description,
                unitPrice,
                totalAmount,
                status: "PENDING",
                userId: session.user.id,
                directionId: null
            }
        });

        return NextResponse.json(newRequest);
    } catch (error) {
        console.error("Error creating request:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création de la demande" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";

        let whereClause: any = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } }
            ]
        };

        // If not SUPER_ADMIN, only show user's own requests
        if (session.user.role !== "SUPER_ADMIN") {
            whereClause.userId = session.user.id;
        }

        const requests = await prisma.request.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                direction: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des demandes" },
            { status: 500 }
        );
    }
}