import { useState } from "react";
import { AI_Prompt } from "@/components/ui/animated-ai-input";
import SimpleContentCard from "@/components/content/SimpleContentCard";
import { useToast } from "@/hooks/use-toast";
import { processContentWithGemini } from "@/lib/gemini";

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

  const handleSaveContent = async (message: string, type: string) => {
    console.log('Saving content:', { message, type });
    
    const analysis = await processContentWithGemini(message);
    
    toast({
      title: "Content saved and analyzed!",
      description: analysis,
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-hero min-h-screen p-4">
      <div className="w-full max-w-xl flex flex-col -mt-44">
        {/* Logo */}
        <div className="flex justify-center pt-4">
          <div className="w-48 h-48 rounded-2xl flex items-center justify-center">
            <img src="/images/logo.svg" alt="HyperSave Logo" className="w-44 h-44" />
          </div>
        </div>
        
        {/* New Prompt Box */}
        <div className="-mt-16">
          <AI_Prompt onSubmit={handleSaveContent} />
        </div>
      </div>
    </div>
  );
};

export default Home;