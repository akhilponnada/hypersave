import { useState } from "react";
import { AI_Prompt } from "@/components/ui/animated-ai-input";
import SimpleContentCard from "@/components/content/SimpleContentCard";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const { toast } = useToast();
  
  // Simplified recent content
  const [recentContent] = useState([
    {
      id: "1",
      title: "Advanced React Patterns",
      description: "Comprehensive guide covering render props, HOCs, and custom hooks for scalable applications.",
      category: "Development",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2", 
      title: "Q1 Planning Meeting Notes",
      description: "Key decisions on product roadmap, resource allocation, and team restructuring initiatives.",
      category: "Work",
      createdAt: new Date("2024-01-14"),
    },
    {
      id: "3",
      title: "UI Design System Guidelines", 
      description: "Complete documentation for color palette, typography, and component library standards.",
      category: "Design",
      createdAt: new Date("2024-01-13"),
    },
    {
      id: "4",
      title: "Weekly Learning Resources",
      description: "Curated articles on user psychology, team building, and sustainable design practices.",
      category: "Learning",
      createdAt: new Date("2024-01-12"),
    },
  ]);

  const handleSaveContent = (message: string, type: string) => {
    console.log('Saving content:', { message, type });
    
    toast({
      title: "Content saved successfully!",
      description: `Your ${type} content is being analyzed and will appear in your dashboard shortly.`,
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-hero min-h-screen">
      {/* Hero Section with Save Box */}
      <div className="px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-2xl flex items-center justify-center">
              <img src="/images/logo.svg" alt="HyperSave Logo" className="w-44 h-44" />
            </div>
          </div>
        </div>
        
        {/* New Prompt Box */}
        <div className="max-w-2xl mx-auto -mt-8">
          <AI_Prompt onSubmit={handleSaveContent} />
        </div>
      </div>

      {/* Recent Activity Section */}
      {recentContent.length > 0 && (
        <div className="px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Recent Activity</h2>
              <p className="text-muted-foreground">Your latest analyzed content</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {recentContent.map((item) => (
                <SimpleContentCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;