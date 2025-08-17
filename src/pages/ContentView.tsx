import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Lightbulb, BarChart2, FileText, Loader2, ExternalLink, Paperclip, Link, CheckCircle2, AlertTriangle, Tag, Calendar, Share2, Heart, Trash2, Info } from "lucide-react";
import { IoLink } from "react-icons/io5";
import { useContent } from "@/contexts/ContentContext";
import { processContentWithGemini, GeminiAnalysis } from "@/lib/gemini";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const ContentSkeleton = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-12" />
            <div className="space-y-12">
                <div>
                    <Skeleton className="h-8 w-1/3 mb-6" />
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
                <div>
                    <Skeleton className="h-8 w-1/3 mb-6" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 space-y-8">
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        </div>
    </div>
);

const EmptyState = ({ icon, title, message }: { icon: React.ReactNode, title: string, message: string }) => (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200/80">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
    </div>
);


const ContentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getContentById, deleteContent, toggleFavorite } = useContent();
    const item = id ? getContentById(id) : undefined;
    const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(item?.analysis || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (item) {
            setLoading(true);
            processContentWithGemini(item.content).then((result) => {
                setAnalysis(result);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [item]);

    const pageVariants = {
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 },
    };

    const pageTransition = {
        type: "tween" as const,
        ease: "circOut" as const,
        duration: 0.5,
    };

    if (!item) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <p className="text-gray-600">Item not found</p>
            </div>
        );
    }

    const isLink = item.type === 'link';
    const url = isLink ? item.content.split(' - ')[0] : null;
    const originalText = isLink ? item.content.split(' - ')[1] || '' : item.content;

    const getIconForItemType = (type: 'link' | 'text' | 'file') => {
        switch (type) {
            case 'link': return <IoLink className="w-4 h-4 text-gray-500" />;
            case 'file': return <Paperclip className="w-4 h-4 text-gray-500" />;
            default: return <FileText className="w-4 h-4 text-gray-500" />;
        }
    }

    const Section = ({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="py-8"
        >
            <div className="flex items-center gap-3 mb-6">
                {icon}
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            <div className="text-base">
                {children}
            </div>
        </motion.div>
    );

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="absolute inset-0 bg-background text-foreground z-50"
        >
            <div className="h-full w-full overflow-y-auto">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/library")}
                  className="absolute top-6 right-6 z-20 h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10 shrink-0 flex items-center justify-center hover:bg-black/20 dark:hover:bg-white/20 transition-all p-0"
                >
                  <X className="w-5 h-5" />
                </Button>

                {loading ? <ContentSkeleton /> : (
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                                <div className="mb-12">
                                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                                        {analysis?.title || item.title}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                        <span className="capitalize">{item.category}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="space-y-12">
                                <Section title="Summary" icon={<Lightbulb className="w-6 h-6 text-yellow-400" />}>
                                    {analysis?.summary ? (
                                        <p className="text-lg leading-relaxed">{analysis.summary}</p>
                                    ) : (
                                        <EmptyState icon={<Lightbulb className="w-6 h-6 text-yellow-400" />} title="No Summary Available" message="The AI couldn't generate a summary for this content." />
                                    )}
                                </Section>

                                {analysis?.keyPoints && analysis.keyPoints.length > 0 && (
                                   <Section title="Key Points" icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}>
                                        <ul className="space-y-4">
                                            {analysis.keyPoints.map((point, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Section>
                                )}

                                {analysis?.visualization.shouldVisualize && (
                                    <Section title="Data Visualization" icon={<BarChart2 className="w-6 h-6 text-indigo-400" />}>
                                        <div className="h-96 w-full bg-black/10 p-4 rounded-xl border border-white/10">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analysis.visualization.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} tickFormatter={(value) => `$${value}`} />
                                                    <Tooltip
                                                        cursor={{ fill: 'rgba(129, 140, 248, 0.1)' }}
                                                        contentStyle={{
                                                            background: 'hsl(var(--background))',
                                                            borderColor: 'hsl(var(--border))',
                                                            borderRadius: '0.75rem',
                                                            boxShadow: '0 8px 24px -8px rgba(0,0,0,0.2)',
                                                        }}
                                                        labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
                                                    />
                                                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Section>
                                )}

                                <Section title="Original Content" icon={<FileText className="w-6 h-6 text-sky-400" />}>
                                    {isLink && url && (
                                        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-black/10 border border-white/10 rounded-xl mb-6 hover:bg-black/20 transition-colors">
                                            <Link className="w-5 h-5 text-sky-400" />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-sky-300">Source Link</p>
                                                <p className="text-sm text-muted-foreground truncate">{url}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                        </a>
                                    )}
                                    <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground">
                                        <p className="whitespace-pre-wrap">
                                            {originalText}
                                        </p>
                                    </div>
                                    {item.images && item.images.length > 0 && (
                                       <div className="mt-6 grid grid-cols-2 gap-4">
                                           {item.images.map((image, index) => (
                                               <img key={index} src={`data:${image.mimeType};base64,${image.data}`} alt={`Uploaded content ${index + 1}`} className="rounded-lg" />
                                           ))}
                                       </div>
                                    )}
                                </Section>
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-black/10 rounded-xl border border-white/10 h-full">
                                    <div className="p-5 border-b border-white/10">
                                        <h3 className="text-lg font-semibold flex items-center gap-2.5"><Info className="w-5 h-5" /> Details</h3>
                                    </div>
                                    <div className="p-5 space-y-4 text-base">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Type</span>
                                            <span className="font-medium capitalize">{item.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Category</span>
                                            <Badge variant="secondary">{item.category}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Created</span>
                                            <span className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">AI Status</span>
                                            <span className="font-medium flex items-center gap-1.5">
                                                {analysis ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                        Completed
                                                    </>
                                                ) : (
                                                    <>
                                                        <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                                                        Processing
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                        {item.tags && item.tags.length > 0 && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <h4 className="text-muted-foreground mb-3">Tags</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ContentView;