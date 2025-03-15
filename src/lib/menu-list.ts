import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Building
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, role?: string): Group[] {
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isDepartementLeader = role === "ADMIN_DPT";

  const departmentLeader = isDepartementLeader ? [
    {
      href: "/users",
      label: "Personnels",
      icon: Users
    }
  ] : [];

  const adminMenus = isSuperAdmin ? [
    {
      href: "/departments",
      label: "Départements",
      icon: Building
    },
    {
      href: "/department-managers",
      label: "Responsable Departement ",
      icon: Users
    }
  ] : [];

  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Acceuil",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/requests",
          label: "Demande",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: isSuperAdmin ? "Administration" : isDepartementLeader ? "Compte" : '',
      menus: isSuperAdmin ? adminMenus : isDepartementLeader ? departmentLeader : []
    }
  ];
}
