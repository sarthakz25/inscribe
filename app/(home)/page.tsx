import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import { Footer } from "./_components/footer";
import { Pricing } from "./_components/pricing";

const HomePage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-5">
        <Heading />
        <Heroes />

      </div>
      <Pricing />
      <Footer />
    </div>
  );
}

export default HomePage;