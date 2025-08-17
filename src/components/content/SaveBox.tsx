import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link, Type, Sparkles, ArrowUp, Mic, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@supabase/auth-helpers-react";
import AuthModal from "../auth/AuthModal";

interface SaveBoxProps {
  onSave: (content: string, type: 'text' | 'link' | 'file') => void;
}

const SaveBox = ({ onSave }: SaveBoxProps) => {
  const user = useUser();
  const [content, setContent] = useState("");
  const [activeType, setActiveType] = useState<'text' | 'link' | 'file'>('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const contentTypes = [
    { id: 'text', label: 'TEXT', icon: Type, bgColor: 'bg-gray-500' },
    { id: 'link', label: 'LINK', icon: Link, bgColor: 'bg-blue-500' },
    { id: 'file', label: 'FILE', icon: Upload, bgColor: 'bg-green-500' },
  ] as const;

  const handleSave = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!content.trim()) return;
    
    setIsProcessing(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(content, activeType);
    setContent("");
    setIsProcessing(false);
  };

  const getPlaceholder = () => {
    switch (activeType) {
      case 'text':
        return "Message...";
      case 'link':
        return "Paste any URL, article, or link here...";
      case 'file':
        return "Drag and drop files or paste file content here...";
      default:
        return "Message...";
    }
  };

  const detectContentType = (content: string) => {
    const trimmed = content.trim();
    
    if (trimmed.match(/^https?:\/\//i) || trimmed.match(/^www\./i)) {
      return { id: 'link', label: 'LINK', icon: Link, bgColor: 'bg-blue-500' };
    }
    
    if (trimmed.match(/\.(jpg|jpeg|png|gif|webp|svg|pdf|doc|docx)$/i)) {
      return { id: 'file', label: 'FILE', icon: Upload, bgColor: 'bg-green-500' };
    }
    
    return { id: 'text', label: 'TEXT', icon: Type, bgColor: 'bg-gray-500' };
  };

  const detectedType = content.trim() ? detectContentType(content) : contentTypes.find(t => t.id === activeType)!;

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="relative bg-background border border-border rounded-3xl shadow-lg overflow-hidden">
          {/* Content Type Tag */}
          {content.trim() && (
            <div className="absolute -top-3 left-6 z-10">
              <div className={cn(
                "px-3 py-1 rounded-full text-white text-xs font-medium tracking-wide",
                detectedType.bgColor
              )}>
                {detectedType.label}
              </div>
            </div>
          )}

          <div className="flex items-end p-4 gap-3">
            {/* File Upload */}
            <label className="cursor-pointer p-2 hover:bg-muted rounded-xl transition-colors">
              <input type="file" className="hidden" name="file" />
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </label>

            {/* Textarea Container */}
            <div className="flex-1 flex items-center">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={getPlaceholder()}
                className={cn(
                  "resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base",
                  "placeholder:text-muted-foreground text-foreground",
                  "scrollbar-hide max-h-[400px] overflow-y-auto"
                )}
                style={{ minHeight: "24px" }}
              />
            </div>

            {/* Voice Recording Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-2 rounded-xl transition-all duration-200 shrink-0 hover:bg-muted text-muted-foreground"
            >
              <Mic className="w-5 h-5" />
            </Button>

            {/* Send Button */}
            <Button
              onClick={handleSave}
              disabled={!content.trim() || isProcessing}
              className={cn(
                "p-2 h-10 w-10 rounded-xl bg-black dark:bg-white text-white dark:text-black shrink-0",
                "hover:bg-black/90 dark:hover:bg-white/90 transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isProcessing ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaveBox;