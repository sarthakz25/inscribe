"use client";

import { Cover } from "@/components/cover";
import { Editor } from "@/components/editor";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

interface DocumentIdPageProps {
    // comes dynamically from folder name to params props
    params: {
        documentId: Id<"documents">;
    };
};

const DocumentIdPage = ({
    params
}: DocumentIdPageProps) => {
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId
    });

    const update = useMutation(api.documents.update);

    const onChange = (content: string) => {
        update({
            id: params.documentId,
            content
        });
    };

    if (document === undefined) {
        return (
            <div>
                <Cover.Skeleton />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-12">
                    <div className="space-y-4 pl-8 pt-10">
                        <Skeleton className="h-14 w-[50%]" />
                        <Skeleton className="h-8 w-[80%]" />
                        <Skeleton className="h-6 w-[40%]" />
                        <Skeleton className="h-6 w-[60%]" />
                    </div>
                </div>
            </div>
        );
    }

    if (document === null) {
        return <div>Not found</div>;
    }

    return (
        <div className="pb-[30vh]">
            <Cover
                preview
                url={document.coverImage}
            />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar
                    preview
                    initialData={document}
                />
                <Editor
                    editable={false}
                    onChange={onChange}
                    initialContent={document.content}
                />
            </div>
        </div>
    );
}

export default DocumentIdPage;