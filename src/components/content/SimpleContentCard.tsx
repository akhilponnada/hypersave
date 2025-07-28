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
    "Development": "bg-category-development text-white",
    "Work": "bg-category-work text-white", 
    "Design": "bg-category-design text-white",
    "Research": "bg-category-research text-white",
    "Personal": "bg-category-personal text-white",
    "Productivity": "bg-category-productivity text-white",
    "Learning": "bg-category-learning text-white",
    "Health": "bg-category-health text-white",
  };
  
  return categoryColors[category] || "bg-muted text-muted-foreground";
};

const SimpleContentCard = ({ item, className }: SimpleContentCardProps) => {
  return (
    <Card className={cn(
      "group hover:shadow-medium transition-all duration-200 cursor-pointer bg-gradient-card border-0 shadow-soft",
      className
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge 
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full border-0",
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