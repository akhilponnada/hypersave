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
import NotFound from "./pages/NotFound";
import { ContentProvider } from "@/contexts/ContentContext";
import { Search } from "lucide-react";

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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />}>
              <Route index element={<Home />} />
              <Route path="library" element={<Library />} />
              <Route path="library/:id" element={<ContentView />} />
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
);

export default App;
