"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Rocket, Search, Settings2, Trash2 } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";
import useSubscription from "@/hooks/use-subscription";
import { useUser } from "@clerk/clerk-react";
import { Spinner } from "@/components/shared/spinner";
import { Progress } from "@/components/ui/progress";

export const Navigation = () => {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const create = useMutation(api.documents.create);
    const search = useSearch();
    const settings = useSettings();
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);

    const [isResetting, setIsRessetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    const { isLoading, plan } = useSubscription(
        user?.emailAddresses[0]?.emailAddress!
    );

    const documents = useQuery(api.documents.getAllDocuments);

    useEffect(() => {
        if (isMobile) {
            collapse();
        } else {
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (
        event: MouseEvent
    ) => {
        if (!isResizingRef.current) return;

        let newWidth = event.clientX;

        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
        }
    };

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsRessetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

            setTimeout(() => setIsRessetting(false), 300);
        }
    };

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsRessetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0");

            setTimeout(() => setIsRessetting(false), 300);
        }
    };

    const handleCreate = () => {
        if (documents?.length && documents.length >= 5 && plan === "Free") {
            toast.error("You can only create 5 pages in the free plan");
            return;
        }

        if (documents?.length && documents.length >= 100 && plan === "Plus") {
            toast.error("You can only create 100 pages in the plus plan");
            return;
        }

        const promise = create({ title: "Untitled" })
            .then((documentId) => router.push(`/documents/${documentId}`));

        toast.promise(promise, {
            loading: "Drafting note...",
            success: "Note ready to use.",
            error: "Note creation failed. Try again."
        });
    };

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}
            >
                <div
                    onClick={collapse}
                    role="button"
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsLeft className="h-6 w-6" />
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto">
                    <div>
                        <UserItem />

                        <div className="p-3 mb-2 bg-primary/5 w-full">
                            {isLoading ? (
                                <div className="w-full flex items-center justify-center">
                                    <Spinner />
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Rocket className="h-4 w-4 text-muted-foreground" />
                                            <p className="font-medium text-muted-foreground">{plan} plan</p>
                                        </div>
                                        {plan === "Free" ? (
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {documents?.length}/5
                                            </p>
                                        ) : plan === "Plus" ? (
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {documents?.length}/100
                                            </p>
                                        ) : (
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {documents?.length} pages
                                            </p>
                                        )}
                                    </div>
                                    {plan === "Free" && (
                                        <Progress
                                            value={
                                                documents?.length && documents.length >= 5
                                                    ? 100
                                                    : (documents?.length || 0) * 20
                                            }
                                            className="mt-2 h-2"
                                        />
                                    )}
                                    {plan === "Plus" && (
                                        <Progress
                                            value={
                                                documents?.length && documents.length >= 100
                                                    ? 100
                                                    : (documents?.length || 0) * 1
                                            }
                                            className="mt-2 h-2"
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        <Item
                            label="Search"
                            icon={Search}
                            isSearch
                            onClick={search.onOpen}
                        />
                        <Item
                            label="Settings"
                            icon={Settings2}
                            isSettings
                            onClick={settings.onOpen}
                        />
                        <Item
                            onClick={handleCreate}
                            label="New Page"
                            icon={PlusCircle}
                        />
                    </div>

                    <div className="my-4">
                        <DocumentList />
                        <Item
                            onClick={handleCreate}
                            icon={Plus}
                            label="Add a Page"
                        />
                        <Popover>
                            <PopoverTrigger className="w-full mt-4">
                                <Item
                                    label="Trash"
                                    icon={Trash2}
                                />
                            </PopoverTrigger>
                            <PopoverContent
                                className="p-0 w-64 sm:w-72"
                                side={isMobile ? "bottom" : "right"}
                            >
                                <TrashBox />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[99999] left-60 w-[calc(100% - 240px)]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full"
                )}
            >
                {!!params.documentId ? (
                    <Navbar
                        isCollapsed={isCollapsed}
                        onResetWidth={resetWidth}
                    />
                ) : (
                    <nav className="bg-transparent p-3 w-full">
                        {
                            isCollapsed &&
                            <MenuIcon
                                onClick={resetWidth}
                                role="button"
                                className="h-6 w-6 text-muted-foreground"
                            />
                        }
                    </nav>
                )}
            </div>
        </>
    );
}