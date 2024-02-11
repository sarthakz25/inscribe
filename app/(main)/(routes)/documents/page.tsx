"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/use-subscription";
import { Spinner } from "@/components/shared/spinner";

const DocumentsPage = () => {
    const { user } = useUser();
    const router = useRouter();

    const create = useMutation(api.documents.create);

    const documents = useQuery(api.documents.getAllDocuments);

    const { isLoading, plan } = useSubscription(
        user?.emailAddresses[0]?.emailAddress!
    );

    const onCreate = () => {
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
    }

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/workspace.svg"
                height="300"
                width="300"
                alt="Empty"
                className="dark:hidden"
            />
            <Image
                src="/workspace-dark.svg"
                height="300"
                width="300"
                alt="Empty"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-semibold">
                Your Workspace, {user?.firstName}
            </h2>
            <Button onClick={onCreate} disabled={isLoading}>
                {isLoading && (
                    <>
                        <Spinner />
                        <span className="ml-2">Loading...</span>
                    </>
                )}
                {!isLoading && (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Note
                    </>
                )}
            </Button>
        </div>
    );
}

export default DocumentsPage;