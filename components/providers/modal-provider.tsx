"use client";

import { useState, useEffect } from "react";
import { SettingsModal } from "@/components/modals/settings-modal";
import { CoverImageModal } from "@/components/modals/cover-image-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    // to stop it from being rendered on server thus preventing any hydration errors
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <SettingsModal />
            <CoverImageModal />
        </>
    );
}
