"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { Check } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

interface PricingCardProps {
    title: string;
    subtitle: string;
    options: string;
    price: string;
    priceId?: string;
}

export const PricingCard = ({
    title,
    subtitle,
    options,
    price,
    priceId
}: PricingCardProps) => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async () => {
        if (price === "Free") {
            router.push("/documents");
            return;
        }
        setIsSubmitting(true);

        try {
            const { data } = await axios.post("/api/stripe/subscription", {
                priceId,
                email: user?.emailAddresses[0].emailAddress,
                userId: user?.id,
            });
            window.open(data, "_self");
            setIsSubmitting(false);
        } catch (error) {
            setIsSubmitting(false);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex flex-col p-6 mx-auto max-w-lg text-center bg-white dark:bg-black rounded-lg border border-zinc-200 shadow dark:border-x-zinc-700 lg:p-8">
            <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
            <p className="font-light text-muted-foreground sm:text-lg">{subtitle}</p>

            <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">
                    {price !== "Free" && "₹"}
                    {price}
                </span>
                <span className="text-muted-foreground">/month</span>
            </div>

            {isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Loader />
                </div>
            )}

            {isAuthenticated && !isLoading && (
                <Button onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader />
                            <span className="ml-2">Submitting</span>
                        </>
                    ) : (
                        "Get Started"
                    )}
                </Button>
            )}

            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button>Sign in</Button>
                </SignInButton>
            )}

            <ul role="list" className="space-y-4 text-left mt-8">
                {options.split(", ").map((option) => (
                    <li key={option} className="flex items-center space-x-3">
                        <Check className="flex-shrink-0 w-5 h-5 text-green-400" />
                        <span>{option}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}