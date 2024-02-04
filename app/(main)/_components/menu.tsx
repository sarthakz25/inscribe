"use client";

import { Button } from "@/components/ui/button";
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
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenuProps {
    documentId: Id<"documents">;
};

export const Menu = ({
    documentId
}: MenuProps) => {
    const router = useRouter();
    const { user } = useUser();
    const params = useParams();

    const archive = useMutation(api.documents.archive);


    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">,
    });

    const onArchive = () => {
        const promise = archive({ id: documentId });

        toast.promise(promise, {
            loading: "Archiving note...",
            success: "Note archived successfully.",
            error: "Archive failed. Please retry.",
        });

        router.push("/documents");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-[1.875rem]"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" alignOffset={8} forceMount>
                <DropdownMenuItem onClick={onArchive} disabled={document?.isArchived}>
                    <Trash className="h-4 w-4 mr-2" />
                    Move to Trash
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                    Last modified by: {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton
            className="h-[1.875rem] w-10"
        />
    )
}
