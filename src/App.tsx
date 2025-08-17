import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Library from "./pages/Library";
import ContentView from "./pages/ContentView";
import Queue from "@/pages/Queue";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { ContentProvider } from "@/contexts/ContentContext";
import { Search } from "lucide-react";
import { supabase } from "./lib/supabase";
import { SessionContextProvider, useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const queryClient = new QueryClient();

const ComingSoon = ({ page }: { page: string }) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">{page} Coming Soon</h2>
      <p className="text-muted-foreground">This functionality will be available here</p>
    </div>
  </div>
);

const App = () => (
  <SessionContextProvider supabaseClient={supabase}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ContentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />}>
                <Route index element={<Home />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="library" element={<Library />} />
                  <Route path="library/:id" element={<ContentView />} />
                </Route>
                <Route path="queue" element={<Queue />} />
                <Route path="search" element={<ComingSoon page="Search" />} />
                <Route path="favorites" element={<ComingSoon page="Favorites" />} />
                <Route path="tags" element={<ComingSoon page="Tags" />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ContentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </SessionContextProvider>
);

export default App;
