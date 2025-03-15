import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN_DPT") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { firstName, lastName, email, password } = await request.json();

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Les champs nom et email sont requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (user.departmentId !== session.user.departmentId) {
      return NextResponse.json(
        { error: "Non autorisé à modifier cet utilisateur" },
        { status: 403 }
      );
    }

    const updateData: any = {
      firstName,
      lastName,
      email
    };

    if (password?.trim()) {
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'utilisateur" },
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

    if (!session || session.user.role !== "ADMIN_DPT") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (user.departmentId !== session.user.departmentId) {
      return NextResponse.json(
        { error: "Non autorisé à supprimer cet utilisateur" },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}