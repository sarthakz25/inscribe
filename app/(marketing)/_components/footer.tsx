import { Button } from "@/components/ui/button";

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-5 bg-background z-50">
            <a href="https://github.com/sarthakz25" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center text-sm whitespace-nowrap font-medium ml-3">
                © 2024 Sarthak Khandelwal
            </a>
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                <Button variant="ghost" size="sm">
                    Privacy Policy
                </Button>
                <Button variant="ghost" size="sm">
                    Terms & Conditions
                </Button>
            </div>
        </div>
    );
}