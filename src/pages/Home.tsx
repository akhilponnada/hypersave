import { AI_Prompt } from "@/components/ui/animated-ai-input";

const Home = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-hero min-h-screen p-4">
      <div className="w-full max-w-xl flex flex-col -mt-44">
        {/* Logo */}
        <div className="flex justify-center pt-4">
          <div className="w-48 h-48 rounded-2xl flex items-center justify-center">
            <img src="/images/logo.svg" alt="HyperSave Logo" className="w-44 h-44" />
          </div>
        </div>
        
        {/* New Prompt Box */}
        <div className="-mt-16">
          <AI_Prompt />
        </div>
      </div>
    </div>
  );
};

export default Home;