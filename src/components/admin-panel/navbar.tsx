import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  title: string;
  showBackButton?: boolean;
  backButtonAction?: () => void;
}

export function Navbar({
  title,
  showBackButton = false,
  backButtonAction
}: NavbarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backButtonAction) {
      backButtonAction();
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          {showBackButton ? (
            <Button
              variant="ghost"
              className="group mr-2 hover:bg-transparent"
              onClick={handleBack}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 transition-transform group-hover:-translate-x-1">
                <ArrowLeft className="h-4 w-4 text-blue-700 dark:text-blue-400" />
              </div>
            </Button>
          ) : (
            <SheetMenu />
          )}
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
