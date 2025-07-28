import { AI_Prompt } from "@/components/ui/animated-ai-input";

export function AI_Prompt_Demo() {
    const handleSubmit = (message: string, model: string) => {
        console.log('Message:', message);
        console.log('Model:', model);
        // Here you can add your message handling logic
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background dark:bg-[#212121] p-4">
            <div className="w-full max-w-xl flex flex-col gap-10">
                <p className="text-center text-3xl text-foreground">
                    How Can I Help You
                </p>
                <AI_Prompt onSubmit={handleSubmit} />
            </div>
        </div>
    );
} 