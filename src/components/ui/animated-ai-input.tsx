"use client";

import { ArrowRight, Mic, Paperclip, Type, Link, Image, Play, Hash } from "lucide-react";
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

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

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

interface AI_PromptProps {
    onSubmit?: (message: string, type: string) => void;
    placeholder?: string;
}

export function AI_Prompt({ onSubmit, placeholder = "Save anything - text, links, files, thoughts..." }: AI_PromptProps) {
    const [value, setValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [detectedContent, setDetectedContent] = useState<ContentType>({ 
        type: 'text', 
        label: 'TEXT',
        bgColor: 'bg-gray-500'
    });
    
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });

    useEffect(() => {
        if (value.trim()) {
            setDetectedContent(detectContentType(value));
        } else {
            setDetectedContent({ type: 'text', label: 'TEXT', bgColor: 'bg-gray-500' });
        }
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && value.trim()) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (!value.trim()) return;
        
        onSubmit?.(value, detectedContent.type);
        setValue("");
        adjustHeight(true);
    };

    const handleVoiceRecord = () => {
        setIsRecording(!isRecording);
        console.log('Voice recording:', isRecording ? 'stopped' : 'started');
    };

    return (
        <div className="w-full py-4">
            <div className="bg-black/5 dark:bg-black/10 rounded-2xl p-1.5">
                <div className="relative">
                    <div className="relative flex flex-col">
                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "400px" }}
                        >
                            <Textarea
                                id="ai-input-15"
                                value={value}
                                placeholder={placeholder}
                                className={cn(
                                    "w-full rounded-xl rounded-b-none px-4 py-3 bg-transparent border-none text-black dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "min-h-[72px]"
                                )}
                                ref={textareaRef}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                            />
                        </div>

                        <div className="h-14 rounded-b-xl flex items-center">
                            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                                <div className="flex items-center gap-2">
                                    {/* Attach Button */}
                                    <button
                                        type="button"
                                        className="p-2 rounded-lg transition-all duration-200 shrink-0 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                                    >
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    {/* Voice Recording Button */}
                                    <button
                                        type="button"
                                        className={cn(
                                            "p-2 rounded-lg transition-all duration-200 shrink-0 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                                            isRecording
                                                ? "text-white shadow-lg"
                                                : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                                        )}
                                        style={isRecording ? { backgroundColor: '#3492ff' } : {}}
                                        onClick={handleVoiceRecord}
                                    >
                                        <motion.div
                                            animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                                            transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
                                        >
                                            <Mic className="w-4 h-4" />
                                        </motion.div>
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {/* Content Type Tag - positioned to the left of send button */}
                                    {value.trim() && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold tracking-wide shadow-lg"
                                            style={{ backgroundColor: '#3492ff' }}
                                        >
                                            {detectedContent.label}
                                        </motion.div>
                                    )}
                                    
                                    <button
                                        type="button"
                                        className="rounded-lg p-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                                        style={{ backgroundColor: '#3492ff' }}
                                        aria-label="Send message"
                                        disabled={!value.trim()}
                                        onClick={handleSubmit}
                                    >
                                        <ArrowRight
                                            className={cn(
                                                "w-4 h-4 text-white transition-opacity duration-200",
                                                value.trim()
                                                    ? "opacity-100"
                                                    : "opacity-50"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}