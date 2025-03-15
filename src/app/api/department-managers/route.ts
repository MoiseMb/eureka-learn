import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const { firstName, lastName, email, password, departmentId } = await request.json();

        // Enhanced validation
        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis et ne peuvent pas être vides' },
                { status: 400 }
            );
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Format d\'email invalide' },
                { status: 400 }
            );
        }


        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Cet email est déjà utilisé' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const manager = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: 'ADMIN_DPT',
            },
            include: {
                department: true
            }
        });


        return NextResponse.json(manager);
    } catch (error) {
        console.error('Error creating department manager:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création du responsable' },
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
        const search = searchParams.get('search') || '';

        const managers = await prisma.user.findMany({
            where: {
                role: 'ADMIN_DPT',
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            }
        });

        const departments = await prisma.department.findMany({
            where: {
                managerId: {
                    in: managers.map(manager => manager.id)
                }
            },
            select: {
                managerId: true,
                name: true
            }
        });

        const departmentByManagerId = departments.reduce((acc, dept) => {
            if (dept.managerId) {
                acc[dept.managerId] = dept.name;
            }
            return acc;
        }, {} as Record<string, string>);

        const formattedManagers = managers.map(manager => ({
            id: manager.id,
            firstName: manager.firstName || '',
            lastName: manager.lastName || '',
            email: manager.email,
            departmentName: departmentByManagerId[manager.id] || null
        }));

        return NextResponse.json({
            managers: formattedManagers,
            total: managers.length
        });
    } catch (error) {
        console.error('Error fetching department managers:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des responsables' },
            { status: 500 }
        );
    }
}