import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPanelLayout>
      <ContentLayout title="Tableau de bord">
        <div>
          <h1>Page de démo</h1>
        </div>
      </ContentLayout>
    </AdminPanelLayout>
  );
}
