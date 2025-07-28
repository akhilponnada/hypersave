import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, ChevronRight } from "lucide-react";
import ContentCard from "@/components/content/ContentCard";

const Dashboard = () => {
  // Mock data - replace with real data from backend
  const [contentItems] = useState([
    {
      id: "1",
      title: "Advanced React Patterns",
      content: "A comprehensive guide to advanced React patterns including render props, higher-order components, and custom hooks for building scalable applications.",
      type: "link" as const,
      category: "Development",
      tags: ["React", "JavaScript", "Patterns", "Frontend"],
      createdAt: new Date("2024-01-15"),
      analyzed: true,
    },
    {
      id: "2",
      title: "Meeting Notes - Q1 Planning",
      content: "Discussion about Q1 goals, team restructuring, and new project initiatives. Key decisions made regarding product roadmap and resource allocation.",
      type: "text" as const,
      category: "Work",
      tags: ["Meeting", "Planning", "Q1", "Strategy"],
      createdAt: new Date("2024-01-14"),
      analyzed: true,
    },
    {
      id: "3",
      title: "UI Design System Guidelines",
      content: "Complete documentation for the company's design system including color palette, typography, component library, and usage guidelines.",
      type: "file" as const,
      category: "Design",
      tags: ["Design System", "UI", "Guidelines", "Documentation"],
      createdAt: new Date("2024-01-13"),
      analyzed: true,
    },
  ]);

  const categories = ["All", "Development", "Work", "Design", "Research", "Personal"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = selectedCategory === "All" 
    ? contentItems 
    : contentItems.filter(item => item.category === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === "All") return contentItems.length;
    return contentItems.filter(item => item.category === category).length;
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Your analyzed content, organized and categorized</p>
            </div>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 mt-6">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  <span className="ml-1 text-xs opacity-75">
                    {getCategoryCount(category)}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {/* Categories Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Categories</h2>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => (
              <div
                key={category}
                className="p-4 rounded-lg border border-border bg-card hover:shadow-card transition-shadow cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <h3 className="font-medium text-card-foreground">{category}</h3>
                <p className="text-2xl font-semibold text-primary mt-1">
                  {getCategoryCount(category)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">items</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Content */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-foreground">
              {selectedCategory === "All" ? "All Content" : selectedCategory}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} items
            </p>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  variant="analyzed"
                  onViewDetails={(id) => console.log('View details:', id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No content found in {selectedCategory.toLowerCase()}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("All")}
              >
                View All Content
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;