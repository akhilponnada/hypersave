import { Home, Search, Archive, Bookmark, Tag, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "library", label: "Library", icon: Archive },
    { id: "search", label: "Search", icon: Search },
  ];

  const libraryItems = [
    { id: "favorites", label: "Favorites", icon: Bookmark },
    { id: "tags", label: "Tags", icon: Tag },
  ];

  return (
    <div className="w-72 h-screen bg-card/50 backdrop-blur-xl border-r border-border/50 flex flex-col shadow-soft">
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">hypersave</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-11 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                activeSection === item.id 
                  ? "bg-primary/10 text-primary shadow-soft border border-primary/20" 
                  : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          );
        })}

        {/* Library Section */}
        <div className="pt-8">
          <h3 className="px-4 pb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Library</h3>
          <div className="space-y-1">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10 px-4 rounded-xl text-sm transition-all duration-200",
                    activeSection === item.id 
                      ? "bg-primary/10 text-primary shadow-soft border border-primary/20" 
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-border/30">
        <div className="text-xs text-muted-foreground">
          <p>Made with 💜 for productivity</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;