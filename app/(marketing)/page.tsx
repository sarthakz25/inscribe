import { Button } from "@/components/ui/button";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import { Footer } from "./_components/footer";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col dark:bg-[#0D0D0D]">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-5 pb-10">
        <Heading />
        <Heroes />
        
      </div>
      <Footer />
    </div>
  );
}

export default MarketingPage;