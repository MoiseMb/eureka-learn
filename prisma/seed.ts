import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        // Création du SUPER_ADMIN
        const hashedPassword = await hash('password', 12);
        const superAdmin = await prisma.user.upsert({
            where: { email: 'admin@edubudget.com' },
            update: {},
            create: {
                email: 'admin@admin.com',
                firstName: ' Pape Moussa',
                lastName: 'MBENGUE',
                password: hashedPassword,
                role: Role.SUPER_ADMIN,
            },
        });

        console.log('Super Admin créé:', superAdmin);


        const deptAdminPassword = await hash('passer', 12);
        const deptAdmin = await prisma.user.upsert({
            where: { email: 'wally@gmail.com' },
            update: {},
            create: {
                email: 'wally@gmail.com',
                firstName: 'Mouhamadou Wally ',
                lastName: 'NDOUR',
                password: deptAdminPassword,
                role: Role.ADMIN_DPT,
            },
        });

        console.log('Admin Département créé:', deptAdmin);

        // Création d'un département de test
        const department = await prisma.department.create({
            data: {
                name: 'Département Informatique',
                managerId: deptAdmin.id,
            },
        });

        console.log('Département créé:', department);

        // Création d'une direction de test
        const direction = await prisma.direction.create({
            data: {
                name: 'Direction des Systèmes d\'Information',
                plannedRevenue: 500000,
                plannedExpenses: 400000,
                managerId: deptAdmin.id,
            },
        });

        console.log('Direction créée:', direction);

        // Création d'un utilisateur normal
        const userPassword = await hash('passer', 12);
        const normalUser = await prisma.user.upsert({
            where: { email: 'souley@gmail.com' },
            update: {},
            create: {
                email: 'souley@gmail.com',
                firstName: 'Souleymande DB ',
                lastName: 'DIOP',
                password: userPassword,
                role: Role.USER,
            },
        });

        const normalUser2 = await prisma.user.upsert({
            where: { email: 'souley@gmail.com' },
            update: {},
            create: {
                email: 'souley@gmail.com',
                firstName: 'Souleymande DB ',
                lastName: 'DIOP',
                password: userPassword,
                role: Role.USER,
            },
        });
        const normalUse3 = await prisma.user.upsert({
            where: { email: 'aminata@gmail.com' },
            update: {},
            create: {
                email: 'aminata@gmail.com',
                firstName: 'Aminata Dioulde ',
                lastName: 'DATH',
                password: userPassword,
                role: Role.USER,
            },
        });

        console.log('Utilisateur normal créé:', normalUser);

        const request = await prisma.request.create({
            data: {
                name: 'Ordinateurs portables',
                category: 'Matériel',
                description: 'Acquisition de nouveaux ordinateurs pour le personnel',
                quantity: 5,
                unitPrice: 1200,
                totalAmount: 6000,
                userId: normalUser.id,
                directionId: direction.id,
            },
        });

        console.log('Demande créée:', request);

    } catch (error) {
        console.error('Erreur lors du seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });