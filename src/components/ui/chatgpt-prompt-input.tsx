"use client";

import { ArrowUp, Mic, Paperclip, Type, Link, Image, Play, Hash } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;

            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    return { textareaRef, adjustHeight };
}

type ContentType = {
    type: 'text' | 'link' | 'image' | 'youtube' | 'facebook' | 'instagram' | 'twitter' | 'tiktok';
    label: string;
    bgColor: string;
};

const detectContentType = (content: string): ContentType => {
    const trimmed = content.trim();
    
    // YouTube detection
    if (trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/i)) {
        return { 
            type: 'youtube', 
            label: 'YOUTUBE',
            bgColor: 'bg-red-600'
        };
    }
    
    // Facebook detection
    if (trimmed.match(/(?:facebook\.com|fb\.com)/i)) {
        return { 
            type: 'facebook', 
            label: 'FACEBOOK',
            bgColor: 'bg-blue-600'
        };
    }
    
    // Instagram detection
    if (trimmed.match(/instagram\.com/i)) {
        return { 
            type: 'instagram', 
            label: 'INSTAGRAM',
            bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
        };
    }
    
    // Twitter/X detection
    if (trimmed.match(/(?:twitter\.com|x\.com)/i)) {
        return { 
            type: 'twitter', 
            label: 'X (TWITTER)',
            bgColor: 'bg-black'
        };
    }
    
    // TikTok detection
    if (trimmed.match(/tiktok\.com/i)) {
        return { 
            type: 'tiktok', 
            label: 'TIKTOK',
            bgColor: 'bg-black'
        };
    }
    
    // General URL detection
    if (trimmed.match(/^https?:\/\//i) || trimmed.match(/^www\./i)) {
        return { 
            type: 'link', 
            label: 'LINK',
            bgColor: 'bg-blue-500'
        };
    }
    
    // Image URL detection
    if (trimmed.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return { 
            type: 'image', 
            label: 'IMAGE',
            bgColor: 'bg-green-500'
        };
    }
    
    // Default to text
    return { 
        type: 'text', 
        label: 'TEXT',
        bgColor: 'bg-gray-500'
    };
};

interface PromptBoxProps {
    onSubmit?: (content: string, type: string) => void;
}

export function PromptBox({ onSubmit }: PromptBoxProps) {
    const [value, setValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [detectedContent, setDetectedContent] = useState<ContentType>({ 
        type: 'text', 
        label: 'TEXT',
        bgColor: 'bg-gray-500'
    });
    
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 56,
        maxHeight: 400,
    });

    useEffect(() => {
        if (value.trim()) {
            setDetectedContent(detectContentType(value));
        } else {
            setDetectedContent({ type: 'text', label: 'TEXT', bgColor: 'bg-gray-500' });
        }
    }, [value]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;
        
        onSubmit?.(value, detectedContent.type);
        setValue("");
        adjustHeight(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && value.trim()) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleVoiceRecord = () => {
        setIsRecording(!isRecording);
        console.log('Voice recording:', isRecording ? 'stopped' : 'started');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
                {/* Content Type Tag */}
                {value.trim() && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-3 left-6 z-10"
                    >
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-white text-xs font-semibold tracking-wide shadow-lg",
                            detectedContent.bgColor
                        )}>
                            {detectedContent.label}
                        </div>
                    </motion.div>
                )}

                <div className="flex items-end p-5 gap-4">
                    {/* File Upload */}
                    <label className="cursor-pointer p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                        <input type="file" className="hidden" name="file" />
                        <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                    </label>

                    {/* Textarea Container */}
                    <div className="flex-1 min-h-[56px] flex items-center">
                        <Textarea
                            ref={textareaRef}
                            name="message"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Message..."
                            className={cn(
                                "resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base",
                                "placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100",
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
                        className={cn(
                            "p-2.5 rounded-xl transition-all duration-200 shrink-0",
                            isRecording 
                                ? "bg-red-500 text-white hover:bg-red-600 shadow-lg" 
                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                        )}
                        onClick={handleVoiceRecord}
                    >
                        <motion.div
                            animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                            transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
                        >
                            <Mic className="w-5 h-5" />
                        </motion.div>
                    </Button>

                    {/* Send Button */}
                    <Button
                        type="submit"
                        disabled={!value.trim()}
                        className={cn(
                            "p-2.5 h-11 w-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shrink-0",
                            "hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                            "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        )}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </form>
    );
}