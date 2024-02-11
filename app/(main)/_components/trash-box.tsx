"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ArchiveRestore, ArchiveX, Flame } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSubscription from "@/hooks/use-subscription";
import { useUser } from "@clerk/clerk-react";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const { user } = useUser();

    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);
    const removeAll = useMutation(api.documents.removeAll);

    const allDocuments = useQuery(api.documents.getAllDocuments);

    const { plan } = useSubscription(
        user?.emailAddresses[0]?.emailAddress!
    );

    const hasArchivedDocuments = documents && documents.length > 0;

    const [search, setSearch] = useState("");

    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">,
    ) => {
        event.stopPropagation();

        if (allDocuments?.length && allDocuments.length >= 5 && plan === "Free") {
            toast.error("You already have 5 pages. Please delete one to restore this page.");
            return;
        }

        if (allDocuments?.length && allDocuments.length >= 100 && plan === "Plus") {
            toast.error("You already have 100 pages. Please delete one to restore this page.");
            return;
        }

        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored successfully.",
            error: "Restoration failed. Please retry."
        });
    };

    const onRemove = (
        documentId: Id<"documents">,
    ) => {
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted successfully.",
            error: "Deletion failed. Try again."
        });

        if (params.documentId === documentId) {
            router.push("/documents");
        }
    };

    const onRemoveAll = () => {
        const promise = removeAll();

        toast.promise(promise, {
            loading: "Deleting archived notes...",
            success: "Archived notes deleted successfully.",
            error: "Failed to delete archived notes. Please try again."
        });
    };

    if (documents === undefined) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-primary-foreground"
                    placeholder="Filter by page title..."
                />
                <ConfirmModal onConfirm={onRemoveAll}>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={!hasArchivedDocuments}
                        className="h-[1.75rem]"
                    >
                        <Flame className="h-4 w-4 text-red-400" />
                    </Button>
                </ConfirmModal>
            </div>
            <div className="p-2">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    Your trash is empty.
                </p>
                {filteredDocuments?.map((document) => (
                    <div
                        key={document._id}
                        role="button"
                        onClick={() => onClick(document._id)}
                        className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                    >
                        <span className="truncate pl-2">{document.title}</span>

                        <div className="flex items-center">
                            <div
                                onClick={(e) => onRestore(e, document._id)}
                                role="button"
                                className="rounded-sm p-2 hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50"
                            >
                                <ArchiveRestore className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                <div
                                    role="button"
                                    className="rounded-sm p-2 hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50"
                                >
                                    <ArchiveX className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}