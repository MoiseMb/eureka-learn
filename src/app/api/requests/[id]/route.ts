import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const { status } = await request.json();

        // Seul le SUPER_ADMIN peut changer le statut
        if (session.user.role !== "SUPER_ADMIN") {
            return NextResponse.json(
                { error: "Non autorisé à modifier le statut" },
                { status: 403 }
            );
        }

        const updatedRequest = await prisma.request.update({
            where: { id: params.id },
            data: { status },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error("Error updating request:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de la demande" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const requestToDelete = await prisma.request.findUnique({
            where: { id: params.id }
        });

        if (!requestToDelete) {
            return NextResponse.json(
                { error: "Demande non trouvée" },
                { status: 404 }
            );
        }

        // Vérifier si l'utilisateur est autorisé à supprimer
        if (
            session.user.role !== "SUPER_ADMIN" &&
            requestToDelete.userId !== session.user.id
        ) {
            return NextResponse.json(
                { error: "Non autorisé à supprimer cette demande" },
                { status: 403 }
            );
        }

        await prisma.request.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: "Demande supprimée avec succès" });
    } catch (error) {
        console.error("Error deleting request:", error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression de la demande" },
            { status: 500 }
        );
    }
}