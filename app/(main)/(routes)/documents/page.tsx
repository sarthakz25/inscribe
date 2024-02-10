"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DocumentsPage = () => {
    const { user } = useUser();
    const router = useRouter();

    const create = useMutation(api.documents.create);

    const onCreate = () => {
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
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Note
            </Button>
        </div>
    );
}

export default DocumentsPage;