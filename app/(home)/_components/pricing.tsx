import React from "react";
import { PricingCard } from "./pricing-card";

const cards = [
    {
        title: "Basic",
        subtitle: "For organizing every corner of your work & life.",
        options: "10 page limit, File upload limited",
        price: "Free",
    },
    {
        title: "Plus",
        subtitle: "A place for small groups to plan & get organized.",
        options: "100 page limit, Unlimited uploads",
        price: "499",
        priceId: "price_1OibCXSBWuDBSPTZqECPsSOA",
    },
    {
        title: "Business",
        subtitle: "An integrated workspace for large organizations.",
        options: "Unlimited usage, Collaborate (soon)",
        price: "999",
        priceId: "price_1OibB4SBWuDBSPTZLVKbrcde",
    }
];

export const Pricing = () => {
    return (
        <div className="max-w-7xl mx-auto container py-14">
            <div className="lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 space-y-8 lg:space-y-0">
                {cards.map((card, idx) => (
                    <PricingCard key={idx} {...card} />
                ))}
            </div>
        </div>
    );
}