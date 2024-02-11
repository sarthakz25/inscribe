import { PricingCard } from "./pricing-card";

const cards = [
    {
        title: "Basic",
        subtitle: "For organizing every corner of your work & life.",
        options: "5 page limit, File upload limited",
        price: "Free",
    },
    {
        title: "Plus",
        subtitle: "A place for small groups to plan & get organized.",
        options: "100 page limit, Unlimited uploads",
        price: "5",
        priceId: "price_1OilNMK8QJbjWE4LTdGjo6fP",
    },
    {
        title: "Business",
        subtitle: "An integrated workspace for large organizations.",
        options: "Unlimited usage, Collaborate (soon)",
        price: "15",
        priceId: "price_1OilZTK8QJbjWE4LpB5GfM0L",
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