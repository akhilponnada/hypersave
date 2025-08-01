"use client";

import { ArrowRight, Mic, Paperclip, Type, Link, Image, Play, Hash, X } from "lucide-react";
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

import { useContent } from "@/contexts/ContentContext";

interface AI_PromptProps {
    placeholder?: string;
}

export function AI_Prompt({ placeholder = "Save anything - text, links, files, thoughts..." }: AI_PromptProps) {
    const [value, setValue] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { addContent } = useContent();
    
    const detectedContent = detectContentType(value);
    
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && value.trim()) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if ((!value.trim() && files.length === 0) || isProcessing) return;

        setIsProcessing(true);

        const textFiles = files.filter(file => file.type.startsWith('text/'));
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        let combinedContent = value;

        if (textFiles.length > 0) {
            const fileContents = await Promise.all(
                textFiles.map(file => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            resolve(event.target?.result as string);
                        };
                        reader.onerror = (error) => {
                            reject(error);
                        };
                        reader.readAsText(file);
                    });
                })
            );
            combinedContent = value + "\n\n" + fileContents.join("\n\n--- (New File) ---\n\n");
        }

        const images = await Promise.all(
            imageFiles.map(file => {
                return new Promise<{mimeType: string, data: string}>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const result = (event.target?.result as string);
                        const base64 = result.split(',')[1];
                        resolve({mimeType: file.type, data: base64});
                    };
                    reader.onerror = (error) => {
                        reject(error);
                    };
                    reader.readAsDataURL(file);
                });
            })
        );

        const detectedType = detectContentType(combinedContent);

        await addContent({
            title: combinedContent.slice(0, 50), // Temporary title
            content: combinedContent,
            images: images,
            type: files.length > 0 ? 'file' : detectedType.type as 'text' | 'link' | 'file',
            category: "Uncategorized",
            tags: [],
        });

        setValue("");
        setFiles([]);
        adjustHeight(true);
        setIsProcessing(false);
    };

    const handleVoiceRecord = () => {
        setIsRecording(!isRecording);
        console.log('Voice recording:', isRecording ? 'stopped' : 'started');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            setFiles(prevFiles => {
                const combined = [...prevFiles, ...newFiles];
                return combined.slice(0, 3); // Limit to 3 files
            });
        }
    };

    return (
        <>
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
                                        <label className="p-2 rounded-lg transition-all duration-200 shrink-0 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-blue-500 border border-border cursor-pointer">
                                            <input type="file" multiple className="hidden" onChange={handleFileChange} />
                                            <Paperclip className="w-4 h-4" />
                                        </label>
                                        {/* Voice Recording Button */}
                                        <motion.button
                                            type="button"
                                            animate={{ width: isRecording ? '100px' : '36px' }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className={cn(
                                                "flex items-center justify-center p-2 rounded-lg shrink-0 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-blue-500 border border-border overflow-hidden",
                                                isRecording
                                                    ? "text-white bg-blue-500"
                                                    : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                                            )}
                                            onClick={handleVoiceRecord}
                                        >
                                            <Mic className="w-4 h-4 shrink-0" />
                                            {isRecording && <span className="ml-2 text-xs whitespace-nowrap">Recording</span>}
                                        </motion.button>
                                        <div className="flex items-center gap-1">
                                           {files.map((file, index) => (
                                               <div key={index} className="text-xs bg-gray-200 dark:bg-gray-700 rounded-lg px-2 py-1 flex items-center border border-border">
                                                   <span>{file.name.substring(0, 5)}...</span>
                                                   <button onClick={() => setFiles(files.filter(f => f !== file))} className="ml-1 text-red-500">
                                                       <X className="w-3 h-3" />
                                                   </button>
                                               </div>
                                           ))}
                                       </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {/* Content Type Tag - positioned to the left of send button */}
                                        {value.trim() && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="px-3 py-1.5 rounded-lg text-send-icon-blue text-xs font-semibold tracking-wide border border-send-icon-blue/20"
                                                style={{ backgroundColor: 'hsla(var(--send-icon-blue), 0.1)' }}
                                            >
                                                {detectedContent.label}
                                            </motion.div>
                                        )}
                                        
                                        <button
                                            type="button"
                                            className="rounded-lg p-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                                            style={{ backgroundColor: '#3492ff' }}
                                            aria-label="Send message"
                                            disabled={(!value.trim() && files.length === 0) || isProcessing}
                                            onClick={handleSubmit}
                                        >
                                            <ArrowRight
                                                className={cn(
                                                    "w-4 h-4 text-white transition-opacity duration-200",
                                                    (!value.trim() && files.length === 0)
                                                        ? "opacity-50"
                                                        : "opacity-100"
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
            <div className="flex items-center justify-center gap-2 -mt-2">
                <span className="text-xs text-muted-foreground">Frequent:</span>
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs rounded-md">Work</Button>
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs rounded-md">Personal</Button>
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs rounded-md">Ideas</Button>
            </div>
        </>
    );
}