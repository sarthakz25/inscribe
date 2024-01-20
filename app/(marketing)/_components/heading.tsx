"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
    return (
        <div className="max-w-4xl space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Elevate Your Work. Discover <span className="underline">Inscribe</span>.
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Where ideas, documents, and plans converge.<br/>
                Work smarter. Work swifter.
            </h3>
            <Button>
                Enter Inscribe
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button> 
        </div>
    );
}