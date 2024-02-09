"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe, Link2, Link2Off } from "lucide-react";

interface PublishProps {
    initialData: Doc<"documents">,
}

export const Publish = ({
    initialData
}: PublishProps) => {
    const origin = useOrigin();
    const update = useMutation(api.documents.update);

    const [copied, setCopied] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const url = `${origin}/preview/${initialData._id}`;

    const onPublish = () => {
        setIsPublishing(true);

        const promise = update({
            id: initialData._id,
            isPublished: true,
        })
            .finally(() => setIsPublishing(false));

        toast.promise(promise, {
            loading: "Publishing...",
            success: "Note published!",
            error: "Failed to publish note."
        });
    };

    const onUnPublish = () => {
        setIsPublishing(true);

        const promise = update({
            id: initialData._id,
            isPublished: false,
        })
            .finally(() => setIsPublishing(false));

        toast.promise(promise, {
            loading: "Unpublishing...",
            success: "Note Unpublished!",
            error: "Failed to Unpublish note."
        });
    };

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-[1.875rem]"
                >
                    {initialData.isPublished ? (
                        <Link2 className="h-4 w-4" />
                    ) : (
                        <Link2Off className="h-4 w-4" />
                    )}
                    {initialData.isPublished && (
                        <Globe
                            className="h-4 w-4 ml-2 text-sky-500"
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-64 sm:w-72"
                align="end"
                alignOffset={1}
                forceMount
            >
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="gap-x-2 flex items-center">
                            <Globe className="text-sky-500 animate-pulse h-4 w-4" />
                            <p className="text-xs font-medium text-muted-foreground">
                                This note is live on web.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                                value={url}
                                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate outline-none"
                                disabled
                            />
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="h-8 rounded-l-none"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            onClick={onUnPublish}
                            disabled={isPublishing}
                            className="h-[1.875rem] w-full text-xs"
                        >
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe
                            className="h-8 w-8 text-muted-foreground mb-2"
                        />
                        <p className="text-sm font-medium mb-2">
                            Publish this note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Share your work with others
                        </span>
                        <Button
                            size="sm"
                            disabled={isPublishing}
                            onClick={onPublish}
                            className="h-[1.875rem] w-full text-xs"
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}