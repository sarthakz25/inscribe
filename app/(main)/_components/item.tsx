"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ItemProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    isSettings?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
}

export const Item = ({
    id,
    label,
    onClick,
    icon: Icon,
    active,
    documentIcon,
    isSearch,
    isSettings,
    level = 0,
    onExpand,
    expanded
}: ItemProps) => {
    const { user } = useUser();
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archive);

    const onArchive = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();

        if (!id) return;

        const promise = archive({ id })
            .then(() => router.push("/documents"));

        toast.promise(promise, {
            loading: "Archiving note...",
            success: "Note archived successfully.",
            error: "Archive failed. Please retry.",
        });
    };

    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();

        onExpand?.();
    };

    const onCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();

        if (!id) return;

        const promise = create({
            title: "Untitled",
            parentDocument: id
        })
            .then((documentId) => {
                if (!expanded) {
                    onExpand?.();
                }

                router.push(`/documents/${documentId}`);
            });

        toast.promise(promise, {
            loading: "Drafting note...",
            success: "Note ready to use.",
            error: "Note creation failed. Try again."
        });
    };

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    return (
        <div
            onClick={onClick}
            role="button"
            style={{
                paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
            }}
            className={
                cn(
                    "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                    active && "bg-primary/5 text-primary"
                )
            }
        >
            {!!id && (
                <div
                    role="button"
                    onClick={handleExpand}
                    className="h-full rounded-sm hover:bg-zinc-300/75 dark:hover:bg-zinc-700/75 mr-1"
                >
                    <ChevronIcon
                        className="h-5 w-5 shrink-0 text-muted-foreground/50"
                    />
                </div>
            )}

            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}
                </div>
            ) : (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
            )}

            <span className="truncate">
                {label}
            </span>

            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border dark:border-zinc-700 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    CTRL K
                </kbd>
            )}

            {isSettings && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border dark:border-zinc-700 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    CTRL J
                </kbd>
            )}

            {!!id && (
                <div className="ml-auto flex items-center gap-x-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto p-[0.125rem] rounded-sm hover:bg-zinc-300/75 dark:hover:bg-zinc-700/75"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="h-4 w-4 mr-2" />
                                Move to Trash
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="text-xs p-2 text-muted-foreground">
                                Last modified by: {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div
                        role="button"
                        onClick={onCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto p-[0.125rem] rounded-sm hover:bg-zinc-300/75 dark:hover:bg-zinc-700/75"
                    >
                        <Plus
                            className="h-4 w-4 text-muted-foreground"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            style={{
                paddingLeft: level ? `${(level * 12) + 36}px` : "16px"
            }}
            className="flex gap-x-2 py-[6px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    );
}