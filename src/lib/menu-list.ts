import {
  Users,
  GraduationCap,
  School,
  ClipboardList,
  LayoutDashboard,
  Settings,
  LucideIcon
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
  const commonMenus = [
    {
      groupLabel: "Principal",
      menus: [
        {
          href: "/dashboard",
          label: "Tableau de bord",
          icon: LayoutDashboard,
        }
      ]
    }
  ];


  const adminMenus = [
    {
      groupLabel: "Administration",
      menus: [
        {
          href: "/admin/student",
          label: "Élèves",
          icon: Users
        },
        {
          href: "/admin/classroom",
          label: "Classes",
          icon: School
        },
        {
          href: "/admin/professor",
          label: "Professeurs",
          icon: GraduationCap
        }
      ]
    }
  ];

  const professorMenus = [
    {
      groupLabel: "Gestion",
      menus: [
        {
          href: "/professor/classroom",
          label: "Mes Classes",
          icon: School
        },
        {
          href: "/my-evaluations",
          label: "Évaluations",
          icon: ClipboardList,
          submenus: [
            {
              href: "/professor/evaluation/create",
              label: "Créer une évaluation"
            },
            {
              href: "/professor/evaluation",
              label: "Liste des évaluations"
            }
          ]
        }
      ]
    }
  ];

  const studentMenus = [
    {
      groupLabel: "Mon Espace",
      menus: [
        {
          href: "/student/evaluation",
          label: "Mes Évaluations",
          icon: ClipboardList
        },
        {
          href: "/student/results",
          label: "Mes Résultats",
          icon: School
        }
      ]
    }
  ];

  switch (role) {
    case "ADMIN":
      return [...commonMenus, ...adminMenus];
    case "PROFESSOR":
      return [...commonMenus, ...professorMenus];
    case "STUDENT":
      return [...commonMenus, ...studentMenus];
    default:
      return commonMenus;
  }
}
