"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { IconPicker } from "./icon-picker";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

interface ToolbarProps {
    initialData: Doc<"documents">;
    preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
    const inputRef = useRef<ElementRef<"textarea">>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialData.title);

    const update = useMutation(api.documents.update);
    const removeIcon = useMutation(api.documents.removeIcon);

    const coverImage = useCoverImage();

    const isMobile = useMediaQuery("(max-width: 768px)");

    const enableInput = () => {
        if (preview) return;

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0);
    };

    const disableInput = () => setIsEditing(false);

    const onInput = (value: string) => {
        setValue(value);
        update({
            id: initialData._id,
            title: value || "Untitled",
        });
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            disableInput();
        }
    };

    const onIconSelect = (icon: string) => {
        update({
            id: initialData._id,
            icon,
        });
    };

    const onRemoveIcon = () => {
        removeIcon({
            id: initialData._id,
        });
    };

    return (
        <div className="px-[3.125rem] group relative">
            {!!initialData.icon && !preview && (
                <div className="flex items-center gap-x-2 group/icon pt-3">
                    <IconPicker onChange={onIconSelect}>
                        <p className="text-6xl hover:opacity-80 transition">
                            {initialData.icon}
                        </p>
                    </IconPicker>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={onRemoveIcon}
                        className={cn(
                            "rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs",
                            isMobile && "opacity-100"
                        )}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            {!!initialData.icon && preview && (
                <p className="text-6xl pt-3">{initialData.icon}</p>
            )}
            <div className={cn(
                "opacity-0 group-hover:opacity-100 flex items-center gap-2 py-7 flex-wrap",
                isMobile && "opacity-100"
            )}>
                {!initialData.icon && !preview && (
                    <IconPicker asChild onChange={onIconSelect}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-muted-foreground"
                        >
                            <Smile className="h-4 w-4 mr-2" />
                            Choose Icon
                        </Button>
                    </IconPicker>
                )}
                {!initialData.coverImage && !preview && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={coverImage.onOpen}
                        className="text-muted-foreground text-xs"
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Set Cover
                    </Button>
                )}
            </div>
            {isEditing && !preview ? (
                <div className="w-full px-4 sm:px-6 lg:px-10">
                    <TextareaAutosize
                        ref={inputRef}
                        value={value}
                        onBlur={disableInput}
                        onKeyDown={onKeyDown}
                        onChange={(e) => onInput(e.target.value)}
                        className="w-full text-3xl sm:text-4xl lg:text-5xl bg-transparent font-bold break-words outline-none resize-none"
                    />
                </div>
            ) : (
                <div
                    onClick={enableInput}
                    className="pb-[11.5px] text-3xl sm:text-4xl lg:text-5xl font-bold break-words outline-none"
                >
                    {initialData.title}
                </div>
            )}
        </div>
    );
};
