import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Outlet } from "react-router-dom";
import Profile from "@/components/auth/Profile";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="relative flex-1 overflow-hidden">
          <div className="absolute top-4 right-4">
            <Profile />
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
