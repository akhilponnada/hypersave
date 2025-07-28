import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SortAsc, List, Grid } from "lucide-react";
import ContentCard from "@/components/content/ContentCard";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - original content before analysis
  const [originalContent] = useState([
    {
      id: "1",
      title: "React Patterns Article",
      content: "https://blog.example.com/advanced-react-patterns - A comprehensive guide to advanced React patterns including render props, higher-order components, and custom hooks for building scalable applications. This article covers best practices and real-world examples.",
      type: "link" as const,
      category: "Development",
      tags: [],
      createdAt: new Date("2024-01-15"),
      analyzed: false,
    },
    {
      id: "2",
      title: "Q1 Planning Meeting",
      content: "Meeting today with the team about Q1 goals. We discussed the new project timeline, resource allocation, and team restructuring. Key decisions: 1) Move forward with the mobile app, 2) Hire 2 new developers, 3) Launch beta by March. Follow up needed on budget approval and vendor contracts.",
      type: "text" as const,
      category: "Work",
      tags: [],
      createdAt: new Date("2024-01-14"),
      analyzed: false,
    },
    {
      id: "3",
      title: "design-system-v2.pdf",
      content: "Complete design system documentation including color palette (primary: #3B82F6, secondary: #10B981), typography scale, component library with 45 components, spacing guidelines (4px base unit), and usage examples. Updated branding guidelines and accessibility standards included.",
      type: "file" as const,
      category: "Design",
      tags: [],
      createdAt: new Date("2024-01-13"),
      analyzed: false,
    },
    {
      id: "4",
      title: "Weekend Reading List",
      content: "Articles to read this weekend: 1) The Psychology of User Experience 2) Building Resilient Teams 3) Future of Web Development 4) Sustainable Design Practices. Also want to check out that new productivity app everyone's talking about.",
      type: "text" as const,
      category: "Personal",
      tags: [],
      createdAt: new Date("2024-01-12"),
      analyzed: false,
    },
  ]);

  const filteredContent = originalContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Library</h1>
              <p className="text-muted-foreground">Your original content in its saved form</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search your library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort by Date
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
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
                onViewDetails={(id) => console.log('View details:', id)}
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