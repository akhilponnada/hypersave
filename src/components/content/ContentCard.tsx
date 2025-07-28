import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, FileText, Link as LinkIcon, MoreHorizontal, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'link' | 'file';
  category: string;
  tags: string[];
  createdAt: Date;
  analyzed?: boolean;
}

interface ContentCardProps {
  item: ContentItem;
  variant?: 'original' | 'analyzed';
  onViewDetails?: (id: string) => void;
}

const ContentCard = ({ item, variant = 'analyzed', onViewDetails }: ContentCardProps) => {
  const getTypeIcon = () => {
    switch (item.type) {
      case 'link':
        return LinkIcon;
      case 'file':
        return FileText;
      default:
        return FileText;
    }
  };

  const TypeIcon = getTypeIcon();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className={cn(
      "hover:shadow-elevated transition-shadow duration-200 cursor-pointer",
      variant === 'original' && "border-l-4 border-l-primary"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TypeIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground capitalize">{item.type}</span>
            {variant === 'analyzed' && (
              <Badge variant="secondary" className="text-xs">
                {item.category}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <h3 className="font-medium text-foreground mb-2 line-clamp-2">
          {item.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {item.content}
        </p>

        {variant === 'analyzed' && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 py-3 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(item.createdAt)}
          </div>
          <div className="flex space-x-2">
            {item.type === 'link' && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Open
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => onViewDetails?.(item.id)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;