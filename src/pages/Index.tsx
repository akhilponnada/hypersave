import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Library from "./Library";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "library":
        return <Library />;
      case "search":
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Search Coming Soon</h2>
              <p className="text-muted-foreground">Advanced search functionality will be available here</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
