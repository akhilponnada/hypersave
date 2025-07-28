import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    }).format(date);
  };

  return (
    <Card className={cn(
      "group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 ease-in-out",
      "bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-md",
      "hover:shadow-lg hover:border-black/15 dark:hover:border-white/15 hover:-translate-y-0.5"
    )}>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-send-icon-blue/10 flex items-center justify-center border border-send-icon-blue/20">
              <TypeIcon className="w-4 h-4 text-foreground/60" />
            </div>
            <h3 className="font-medium text-foreground text-sm leading-tight">
              {item.title}
            </h3>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-md">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {item.content}
        </p>
      </CardContent>

      <CardFooter className="px-4 py-2.5 bg-black/5 dark:bg-black/20 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>{formatDate(item.createdAt)}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs rounded-md">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {item.type === 'link' && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-md">
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Open
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-md"
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