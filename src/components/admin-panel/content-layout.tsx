import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

export function ContentLayout({
  title,
  children,
  showBackButton = false
}: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} showBackButton={showBackButton} />
      <div className="container pt-8 pb-8   px-4 sm:px-8">{children}</div>
    </div>
  );
}
