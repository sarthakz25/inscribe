"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

interface CoverProps {
    url?: string;
    preview?: boolean;
};

export const Cover = ({
    url,
    preview
}: CoverProps) => {
    const coverImage = useCoverImage();
    const params = useParams();

    const removeCoverImage = useMutation(api.documents.removeCover);

    const onRemove = () => {
        removeCoverImage({ id: params.documentId as Id<"documents"> });
    };

    return (
        <div
            className={cn(
                "relative w-full h-[35vh] group",
                !url && "h-[12vh]",
                url && "bg-muted-foreground/10"
            )}
        >
            {!!url && (
                <Image
                    src={url}
                    fill
                    alt="Cover Image"
                    className="object-cover"
                />
            )}
            {url && !preview && (
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={coverImage.onOpen}
                        className="text-muted-foreground text-xs"
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Change
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRemove}
                        className="text-muted-foreground text-xs"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                    </Button>
                </div>
            )}
        </div>
    );
}
