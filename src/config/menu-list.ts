import {
    LayoutDashboard,
    Building2,
    Users
} from "lucide-react";

export const menuList = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        role: ["SUPER_ADMIN", "ADMIN_DPT", "USER"]
    },
    {
        title: "Responsables de département",
        href: "/department-managers",
        icon: Users,
        role: ["SUPER_ADMIN"]
    },
    {
        title: "Départements",
        href: "/departments",
        icon: Building2,
        role: ["SUPER_ADMIN"]
    }
]; 