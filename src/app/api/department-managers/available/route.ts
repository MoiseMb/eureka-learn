import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const managers = await prisma.user.findMany({
            where: {
                role: 'ADMIN_DPT',
                department: null // Only get managers without a department
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
            orderBy: {
                firstName: 'asc'
            }
        });

        return NextResponse.json({ managers });
    } catch (error) {
        console.error('Error fetching available managers:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des responsables disponibles' },
            { status: 500 }
        );
    }
}