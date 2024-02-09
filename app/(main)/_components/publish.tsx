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
            loading: "Publishing note...",
            success: "Note is now live.",
            error: "Publish failed. Please retry."
        });
    };

    const onUnpublish = () => {
        setIsPublishing(true);

        const promise = update({
            id: initialData._id,
            isPublished: false,
        })
            .finally(() => setIsPublishing(false));

        toast.promise(promise, {
            loading: "Reverting note to private...",
            success: "Note is private again.",
            error: "Privacy switch failed. Try again."
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
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="max-w-md"
                align="end"
                forceMount
            >
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="gap-x-2 flex items-center">
                            <Globe className="text-sky-500 animate-pulse h-4 w-4" />
                            <p className="text-xs font-medium text-muted-foreground">
                                Note is currently visible on the web.
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
                            onClick={onUnpublish}
                            disabled={isPublishing}
                            className="h-[1.875rem] w-full text-xs"
                        >
                            Make Private
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe
                            className="h-8 w-8 text-muted-foreground mb-2"
                        />
                        <p className="text-sm font-medium mb-2">
                            Ready to share?
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Make your note accessible to others.
                        </span>
                        <Button
                            size="sm"
                            disabled={isPublishing}
                            onClick={onPublish}
                            className="h-[1.875rem] w-full text-xs"
                        >
                            Go Live
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}