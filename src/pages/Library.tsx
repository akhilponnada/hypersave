import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SortAsc } from "lucide-react";
import ContentCard from "@/components/content/ContentCard";
import { cn } from "@/lib/utils";
import { useContent } from "@/contexts/ContentContext";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
        <div className="px-8 py-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-foreground">Library</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-send-icon-blue">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search your Threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base bg-white/10 dark:bg-black/10 border-white/20 dark:border-black/20 ring-1 ring-send-icon-blue focus:ring-2 focus:ring-offset-0 focus:ring-send-icon-blue"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredContent.length} items in your library
          </p>
        </div>

        {filteredContent.length > 0 ? (
          <div className="space-y-4">
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