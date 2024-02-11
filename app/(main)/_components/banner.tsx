"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import useSubscription from "@/hooks/use-subscription";
import { useUser } from "@clerk/clerk-react";

interface BannerProps {
    documentId: Id<"documents">;
};

export const Banner = ({
    documentId
}: BannerProps) => {
    const router = useRouter();
    const { user } = useUser();

    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const allDocuments = useQuery(api.documents.getAllDocuments);

    const { plan } = useSubscription(
        user?.emailAddresses[0]?.emailAddress!
    );

    const onRestore = () => {
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

    const onRemove = () => {
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted successfully.",
            error: "Deletion failed. Try again."
        });

        router.push("/documents");
    };

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p>
                Page is in Trash.
            </p>
            <Button
                size="sm"
                variant="outline"
                onClick={onRestore}
                className="border-white/75 bg-transparent hover:bg-primary/10 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-white/75 bg-transparent hover:bg-primary/10 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete
                </Button>
            </ConfirmModal>
        </div>
    );
}
