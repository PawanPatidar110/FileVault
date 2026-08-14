import {
    CheckCircle2,
    CircleAlert,
    Info,
    X,
} from "lucide-react";

export type ToastType =
    | "success"
    | "error"
    | "info";

interface ToastProps {
    type: ToastType;
    message: string;
    onClose: () => void;
}

const Toast = ({
    type,
    message,
    onClose,
}: ToastProps) => {
    const config = {
        success: {
            icon: CheckCircle2,
            iconClass: "text-emerald-400",
        },
        error: {
            icon: CircleAlert,
            iconClass: "text-red-400",
        },
        info: {
            icon: Info,
            iconClass: "text-violet-400",
        },
    };

    const {
        icon: Icon,
        iconClass,
    } = config[type];

    return (
        <div
            className="
                fixed
                right-5
                top-5
                z-[100]
                flex
                w-[360px]
                max-w-[calc(100vw-40px)]
                items-center
                gap-3
                rounded-2xl
                border
                border-white/[0.08]
                bg-[#111216]/95
                px-4
                py-3.5
                shadow-2xl
                shadow-black/40
                backdrop-blur-xl
                animate-in
                slide-in-from-right-5
                fade-in
                duration-200
            "
        >
            <Icon
                size={19}
                className={`shrink-0 ${iconClass}`}
            />

            <p
                className="
                    min-w-0
                    flex-1
                    text-xs
                    leading-5
                    text-zinc-300
                "
            >
                {message}
            </p>

            <button
                type="button"
                onClick={onClose}
                className="
                    shrink-0
                    rounded-lg
                    p-1.5
                    text-zinc-600
                    transition
                    hover:bg-white/[0.05]
                    hover:text-zinc-300
                "
                title="Close"
            >
                <X size={15} />
            </button>
        </div>
    );
};

export default Toast;