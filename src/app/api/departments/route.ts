import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const { name, managerId } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: 'Le nom et les budgets sont requis' },
                { status: 400 }
            );
        }

        if (managerId) {
            const existingManager = await prisma.user.findFirst({
                where: {
                    id: managerId,
                    role: 'ADMIN_DPT',
                    department: null
                }
            });

            if (!existingManager) {
                return NextResponse.json(
                    { error: 'Le responsable sélectionné n\'est pas disponible' },
                    { status: 400 }
                );
            }
        }

        const department = await prisma.department.create({
            data: {
                name,
                managerId: managerId || null
            }
        });

        return NextResponse.json(department);
    } catch (error) {
        console.error('Error creating department:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création du département' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        const [departments, total, managers] = await Promise.all([
            prisma.department.findMany({
                where: {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    name: 'asc'
                }
            }),
            prisma.department.count({
                where: {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            }),
            prisma.user.findMany({
                where: {
                    role: 'ADMIN_DPT'
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            })
        ]);

        const departmentsWithManagers = departments.map(dept => ({
            ...dept,
            manager: managers.find(m => m.id === dept.managerId) || null
        }));

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            departments: departmentsWithManagers,
            total,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des départements' },
            { status: 500 }
        );
    }
}