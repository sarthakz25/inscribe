import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-5 bg-background z-50">
            <a href="https://github.com/sarthakz25" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center text-sm whitespace-nowrap font-medium ml-3">
                © 2024 Sarthak Khandelwal
            </a>
            <div className="md:ml-auto w-full md:justify-end flex items-center gap-x-2 text-muted-foreground">
                <Popover>
                    <PopoverTrigger>
                        <Button variant="ghost" size="sm">
                            Terms
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="p-3 text-sm">
                            <p className="font-medium mb-2 text-primary/75">
                                Welcome to Inscribe! By using our services, you agree to the following terms:
                            </p>
                            <ul className="font-normal space-y-1 text-primary/50">
                                <li>No illegal, dangerous or infringing uploads.</li>
                                <li>Free plans have basic features, paid unlocks more tools.</li>
                                <li>You own your data, we won't share it without permission.</li>
                                <li>We may remove content or accounts that violate rules.</li>
                            </ul>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}