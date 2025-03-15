import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const department = await prisma.department.delete({
            where: {
                id: params.id
            }
        });

        return NextResponse.json(department);
    } catch (error) {
        console.error('Error deleting department:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du département' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const { name, plannedRevenue, plannedExpenses, managerId } = await request.json();

        const department = await prisma.department.update({
            where: {
                id: params.id
            },
            data: {
                name,
                managerId
            }
        });

        return NextResponse.json(department);
    } catch (error) {
        console.error('Error updating department:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la modification du département' },
            { status: 500 }
        );
    }
} 