import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function processMonthlyStats(requests: any[]) {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthlyData = new Map();

    requests.forEach(request => {
        const date = new Date(request.createdAt);
        const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;

        if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, {
                month: monthKey,
                total: 0,
                approved: 0,
                rejected: 0
            });
        }

        const data = monthlyData.get(monthKey);
        data.total++;
        if (request.status === 'APPROVED') data.approved++;
        if (request.status === 'REJECTED') data.rejected++;
    });

    return Array.from(monthlyData.values());
}

function processRecentActivity(activities: any[]) {
    return activities.map(activity => ({
        id: activity.id,
        type: 'REQUEST',
        user: {
            name: `${activity.user.firstName} ${activity.user.lastName}`,
            avatar: activity.user.image
        },
        description: `Demande de ${activity.totalAmount.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        })} pour ${activity.direction.name}`,
        timestamp: activity.createdAt,
        status: activity.status,
        amount: activity.totalAmount
    }));
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }

    // Mock data for better visualizations
    const mockData = {
        totalUsers: 156,
        totalDepartments: 8,
        totalRequests: 427,
        pendingRequests: 45,
        approvedRequests: 342,
        rejectedRequests: 40,
        departmentBudget: {
            plannedRevenue: 1500000,
            plannedExpenses: 1200000,
            currentExpenses: 800000,
            budgetCategories: [
                { name: "Personnel", amount: 450000 },
                { name: "Équipement", amount: 200000 },
                { name: "Formation", amount: 100000 },
                { name: "Marketing", amount: 150000 },
                { name: "R&D", amount: 300000 }
            ]
        },
        monthlyRequests: [
            { month: "Jan 2024", total: 45, approved: 38, rejected: 7 },
            { month: "Fév 2024", total: 52, approved: 43, rejected: 9 },
            { month: "Mar 2024", total: 38, approved: 30, rejected: 8 },
            { month: "Avr 2024", total: 61, approved: 50, rejected: 11 },
            { month: "Mai 2024", total: 47, approved: 40, rejected: 7 }
        ],
        recentActivity: Array.from({ length: 10 }, (_, i) => ({
            id: `act-${i}`,
            type: 'REQUEST',
            user: {
                name: `Utilisateur ${i + 1}`,
                avatar: null
            },
            description: `Demande de ${(Math.random() * 10000).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
            })} pour Projet ${i + 1}`,
            timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            status: ['APPROVED', 'PENDING', 'REJECTED'][Math.floor(Math.random() * 3)],
            amount: Math.random() * 10000
        })),
        departmentPerformance: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
            budget: [120000, 125000, 130000, 128000, 135000],
            actual: [118000, 122000, 129000, 125000, 132000]
        },
        requestTrends: {
            daily: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20)),
            weekly: Array.from({ length: 4 }, () => Math.floor(Math.random() * 100)),
            monthly: Array.from({ length: 12 }, () => Math.floor(Math.random() * 400))
        }
    };

    return new Response(JSON.stringify(mockData));
}