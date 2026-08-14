import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type { ToastType } from "../components/Toast";

interface ToastState {
    type: ToastType;
    message: string;
}

export const useToast = () => {
    const [toast, setToast] =
        useState<ToastState | null>(null);

    const showToast = useCallback(
        (
            type: ToastType,
            message: string
        ) => {
            setToast({
                type,
                message,
            });
        },
        []
    );

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [toast]);

    return {
        toast,
        showToast,
        hideToast,
    };
};