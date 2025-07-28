import { Home, Search, Archive, Bookmark, Tag, Bot } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "library", label: "Library", icon: Archive },
  { id: "search", label: "Search", icon: Search },
];

const libraryItems = [
  { id: "favorites", label: "Favorites", icon: Bookmark },
  { id: "tags", label: "Tags", icon: Tag },
];

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border/50" collapsible="icon">
      <SidebarContent>
        {/* Trigger Button for collapsed state */}
        {isCollapsed && (
          <div className="p-2 pt-6">
            <SidebarTrigger />
          </div>
        )}

        {/* Header */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <img src="/images/favicon.svg" alt="HyperSave Logo" className="w-8 h-8" />
              </div>
              <SidebarTrigger />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup className={isCollapsed ? "pt-16" : ""}>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      className={cn(
                        "h-11 rounded-xl transition-all duration-200",
                        isActive 
                          ? "bg-send-icon-blue/10 text-send-icon-blue border border-send-icon-blue/20"
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Library Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      className={cn(
                        "h-10 rounded-xl transition-all duration-200",
                        isActive 
                          ? "bg-send-icon-blue/10 text-send-icon-blue border border-send-icon-blue/20"
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        {!isCollapsed && (
          <div className="mt-auto p-6 border-t border-border/30">
            <div className="text-xs text-muted-foreground">
              <p>Made with 💜 for productivity</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}