import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { hashPassword } from '@/lib/auth';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const { firstName, lastName, email, password, departmentId } = await request.json();

        if (!firstName || !lastName || !email) {
            return NextResponse.json(
                { error: 'Les champs nom et prénom sont requis' },
                { status: 400 }
            );
        }

        const updateData: any = {
            firstName,
            lastName,
            email,
        };

        if (password) {
            updateData.password = await hashPassword(password);
        }

        const manager = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json(manager);
    } catch (error) {
        console.error('Error updating department manager:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la modification du responsable' },
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

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        await prisma.user.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: 'Responsable supprimé avec succès' });
    } catch (error) {
        console.error('Error deleting department manager:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du responsable' },
            { status: 500 }
        );
    }
} 