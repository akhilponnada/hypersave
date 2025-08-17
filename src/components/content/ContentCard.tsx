import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExternalLink, FileText, MoreHorizontal, Calendar, Eye, Trash2, Share2, Pin } from "lucide-react";
import { IoLink } from "react-icons/io5";
import { Link } from "react-router-dom";
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
        return IoLink;
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
      "group relative flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
      "bg-transparent dark:bg-transparent border-b border-black/10 dark:border-white/10 rounded-none shadow-none",
      "hover:bg-black/5 dark:hover:bg-white/5"
    )}>
      <CardContent className="p-4 flex-grow cursor-pointer" onClick={() => onViewDetails?.(item.id)}>
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <h3 className="font-medium text-foreground text-base leading-tight mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {item.content}
            </p>
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
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-md" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onViewDetails?.(item.id)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="w-4 h-4 mr-2" />
                Pin
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;