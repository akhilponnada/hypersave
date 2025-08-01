import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SortAsc, List, Grid } from "lucide-react";
import ContentCard from "@/components/content/ContentCard";
import { cn } from "@/lib/utils";
import { useContent } from "@/contexts/ContentContext";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();
  const { content } = useContent();

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-white/10 dark:border-black/10 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-foreground">Library</h1>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 bg-white/10 dark:bg-black/10 border-white/20 dark:border-black/20 focus:ring-send-icon-blue"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-send-icon-blue">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort
              </Button>
              <div className="flex items-center bg-black/5 dark:bg-black/10 p-1 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "h-7 w-7 p-0",
                    viewMode === 'grid' && "bg-send-icon-blue/10 text-send-icon-blue border border-send-icon-blue/20"
                  )}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "h-7 w-7 p-0",
                    viewMode === 'list' && "bg-send-icon-blue/10 text-send-icon-blue border border-send-icon-blue/20"
                  )}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredContent.length} items in your library
          </p>
        </div>

        {filteredContent.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" 
              : "space-y-4"
          }>
            {filteredContent.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                variant="original"
                onViewDetails={(id) => navigate(`/library/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              {searchQuery ? (
                <p>No content found matching "{searchQuery}"</p>
              ) : (
                <p>Your library is empty. Start saving content to see it here.</p>
              )}
            </div>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;