import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
}

interface SimpleContentCardProps {
  item: ContentItem;
  className?: string;
}

const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    "Development": "bg-gradient-category-development",
    "Work": "bg-gradient-category-work",
    "Design": "bg-gradient-category-design",
    "Research": "bg-gradient-category-research",
    "Personal": "bg-gradient-category-personal",
    "Productivity": "bg-gradient-category-productivity",
    "Learning": "bg-gradient-category-learning",
    "Health": "bg-gradient-category-health",
  };
  
  return categoryColors[category] || "bg-muted";
};

const SimpleContentCard = ({ item, className }: SimpleContentCardProps) => {
  return (
    <Card className={cn(
      "group transition-all duration-300 ease-in-out cursor-pointer bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 dark:border-black/20 shadow-lg hover:shadow-xl hover:border-white/30 dark:hover:border-black/30",
      className
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge 
            className={cn(
              "text-xs font-bold text-white px-3 py-1.5 rounded-lg border-0 shadow-md",
              getCategoryColor(item.category)
            )}
          >
            {item.category}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default SimpleContentCard;