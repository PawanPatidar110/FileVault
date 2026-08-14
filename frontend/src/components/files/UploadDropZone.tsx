import {
    UploadCloud,
    X,
} from "lucide-react";

import {
    useRef,
    useState,
} from "react";

import type { FileVisibility } from "../../types/file";

interface UploadDropzoneProps {
    onUpload: (
        file: File,
        visibility: FileVisibility
    ) => Promise<void>;
    onClose: () => void;
}

const UploadDropzone = ({
    onUpload,
    onClose,
}: UploadDropzoneProps) => {

    const inputRef =
        useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [visibility, setVisibility] =
        useState<FileVisibility>("PRIVATE");

    const [uploading, setUploading] =
        useState(false);

    const [dragging, setDragging] =
        useState(false);

    const handleFile = (
        file?: File
    ) => {
        if (!file) return;

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);

        try {
            await onUpload(
                selectedFile,
                visibility
            );

            onClose();
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="
            rounded-2xl
            border
            border-white/[0.08]
            bg-[#0e1014]
            p-5
        ">

            <div className="mb-5 flex items-center justify-between">

                <div>
                    <h3 className="text-sm font-semibold text-zinc-200">
                        Upload file
                    </h3>

                    <p className="mt-1 text-xs text-zinc-600">
                        Add a file to your FileHub.
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="
                        rounded-lg
                        p-2
                        text-zinc-600
                        hover:bg-white/[0.05]
                        hover:text-zinc-300
                    "
                >
                    <X size={17} />
                </button>

            </div>

            {!selectedFile ? (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() =>
                        setDragging(false)
                    }
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);

                        handleFile(
                            e.dataTransfer.files[0]
                        );
                    }}
                    onClick={() =>
                        inputRef.current?.click()
                    }
                    className={`
                        flex
                        min-h-52
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-dashed
                        px-6
                        text-center
                        transition
                        ${
                            dragging
                                ? "border-violet-400 bg-violet-500/[0.06]"
                                : "border-white/[0.08] bg-white/[0.015] hover:border-violet-500/30 hover:bg-white/[0.025]"
                        }
                    `}
                >

                    <div className="
                        mb-4
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-violet-500/10
                    ">
                        <UploadCloud
                            size={22}
                            className="text-violet-400"
                        />
                    </div>

                    <p className="text-sm font-medium text-zinc-300">
                        Drop your file here
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                        or click to browse from your device
                    </p>

                    <p className="mt-4 text-[10px] text-zinc-700">
                        Files are securely stored in your workspace
                    </p>

                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                            handleFile(
                                e.target.files?.[0]
                            )
                        }
                    />

                </div>
            ) : (
                <div className="space-y-5">

                    <div className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.025]
                        p-4
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-violet-500/10
                            text-violet-400
                        ">
                            <UploadCloud size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-zinc-200">
                                {selectedFile.name}
                            </p>

                            <p className="mt-1 text-[11px] text-zinc-600">
                                {formatBytes(
                                    selectedFile.size
                                )}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                setSelectedFile(null)
                            }
                            className="text-xs text-zinc-600 hover:text-zinc-300"
                        >
                            Change
                        </button>

                    </div>

                    {/* Visibility */}
                    <div>

                        <p className="
                            mb-2
                            text-xs
                            font-medium
                            text-zinc-400
                        ">
                            Visibility
                        </p>

                        <div className="grid grid-cols-2 gap-3">

                            <VisibilityButton
                                active={
                                    visibility ===
                                    "PRIVATE"
                                }
                                title="Private"
                                description="Only you can access it"
                                onClick={() =>
                                    setVisibility(
                                        "PRIVATE"
                                    )
                                }
                            />

                            <VisibilityButton
                                active={
                                    visibility ===
                                    "PUBLIC"
                                }
                                title="Public"
                                description="Anyone with the link"
                                onClick={() =>
                                    setVisibility(
                                        "PUBLIC"
                                    )
                                }
                            />

                        </div>

                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="
                            flex
                            h-11
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            bg-violet-500
                            text-sm
                            font-medium
                            transition
                            hover:bg-violet-400
                            disabled:opacity-50
                        "
                    >
                        {uploading
                            ? "Uploading..."
                            : "Upload file"}
                    </button>

                </div>
            )}

        </div>
    );
};

const VisibilityButton = ({
    active,
    title,
    description,
    onClick,
}: {
    active: boolean;
    title: string;
    description: string;
    onClick: () => void;
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                rounded-xl
                border
                p-3
                text-left
                transition
                ${
                    active
                        ? "border-violet-500/40 bg-violet-500/[0.06]"
                        : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.035]"
                }
            `}
        >
            <p className={`
                text-xs
                font-medium
                ${
                    active
                        ? "text-violet-300"
                        : "text-zinc-400"
                }
            `}>
                {title}
            </p>

            <p className="mt-1 text-[10px] text-zinc-600">
                {description}
            </p>
        </button>
    );
};

const formatBytes = (bytes: number) => {
    if (!bytes) return "0 Bytes";

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return `${(
        bytes /
        Math.pow(1024, index)
    ).toFixed(1)} ${units[index]}`;
};

export default UploadDropzone;