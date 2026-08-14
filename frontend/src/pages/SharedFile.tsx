import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { FileItem } from "../types/file";
import { getSharedFile } from "../api/file.api";
import { ArrowDownToLine, Cloud, File, FileArchive, FileImage, FileText, Lock, ShieldCheck } from "lucide-react";

const SharedFile = () => {
    const { shareToken } = useParams<{
        shareToken: string;
    }>();

    const [file, setFile] =
        useState<FileItem | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadSharedFile = async () => {
            if (!shareToken) {
                setError("Invalid share link");
                setLoading(false);
                return;
            }

            try {
                const data =
                    await getSharedFile(
                        shareToken
                    );

                setFile(data);
            } catch (error: any) {
                setError(
                    error?.response?.data?.message ||
                    "This file is no longer available"
                );
            } finally {
                setLoading(false);
            }
        };

        loadSharedFile();
    }, [shareToken]);

    if (loading) {
        return <LoadingState />;
    }

    if (error || !file) {
        return (
            <ErrorState
                message={
                    error ||
                    "File not found"
                }
            />
        );
    }

    return (
        <div className="
            relative
            min-h-screen
            overflow-hidden
            bg-[#08090b]
            text-white
        ">

            {/* Background glow */}

            <div className="
                pointer-events-none
                absolute
                left-1/2
                top-[-180px]
                h-[500px]
                w-[500px]
                -translate-x-1/2
                rounded-full
                bg-violet-600/[0.08]
                blur-[120px]
            " />

            {/* Header */}

            <header className="
                relative
                flex
                h-20
                items-center
                justify-between
                border-b
                border-white/[0.06]
                px-6
                lg:px-10
            ">

                <Link
                    to="/"
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-violet-500
                        shadow-lg
                        shadow-violet-500/20
                    ">
                        <Cloud
                            size={18}
                        />
                    </div>

                    <span className="
                        text-sm
                        font-semibold
                        tracking-tight
                    ">
                        FileHub
                    </span>

                </Link>

                <div className="
                    flex
                    items-center
                    gap-2
                    text-[11px]
                    text-zinc-600
                ">
                    <ShieldCheck
                        size={14}
                        className="text-emerald-500"
                    />

                    Secure file sharing
                </div>

            </header>

            {/* Main */}

            <main className="
                relative
                flex
                min-h-[calc(100vh-5rem)]
                items-center
                justify-center
                px-5
                py-12
            ">

                <div className="
                    w-full
                    max-w-lg
                ">

                    {/* Heading */}

                    <div className="
                        mb-8
                        text-center
                    ">

                        <p className="
                            mb-3
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-violet-400
                        ">
                            Shared file
                        </p>

                        <h1 className="
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-white
                            sm:text-3xl
                        ">
                            Someone shared a file with you
                        </h1>

                        <p className="
                            mt-2
                            text-sm
                            text-zinc-600
                        ">
                            You can download this file securely.
                        </p>

                    </div>

                    {/* File card */}

                    <div className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-white/[0.08]
                        bg-white/[0.025]
                        shadow-2xl
                        shadow-black/30
                        backdrop-blur-xl
                    ">

                        {/* Preview */}

                        <div className="
                            flex
                            min-h-64
                            items-center
                            justify-center
                            border-b
                            border-white/[0.06]
                            bg-white/[0.015]
                            px-6
                        ">

                            <div className="
                                flex
                                flex-col
                                items-center
                            ">

                                <div className="
                                    flex
                                    h-20
                                    w-20
                                    items-center
                                    justify-center
                                    rounded-3xl
                                    border
                                    border-white/[0.08]
                                    bg-white/[0.04]
                                    shadow-xl
                                ">
                                    <FileIcon
                                        mimeType={
                                            file.mimeType
                                        }
                                        size={34}
                                    />
                                </div>

                                <p className="
                                    mt-5
                                    max-w-xs
                                    truncate
                                    text-sm
                                    font-medium
                                    text-zinc-200
                                ">
                                    {file.originalName}
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-zinc-600
                                ">
                                    {file.mimeType}
                                    {" · "}
                                    {formatBytes(
                                        Number(file.size)
                                    )}
                                </p>

                            </div>

                        </div>

                        {/* Information */}

                        <div className="p-6">

                            <div className="
                                mb-5
                                flex
                                items-center
                                justify-between
                            ">

                                <div>
                                    <p className="
                                        text-[10px]
                                        uppercase
                                        tracking-wider
                                        text-zinc-700
                                    ">
                                        File
                                    </p>

                                    <p className="
                                        mt-1
                                        max-w-[280px]
                                        truncate
                                        text-sm
                                        font-medium
                                        text-zinc-300
                                    ">
                                        {file.originalName}
                                    </p>
                                </div>

                                <div className="
                                    flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    bg-emerald-500/[0.08]
                                    px-2.5
                                    py-1.5
                                    text-[10px]
                                    font-medium
                                    text-emerald-400
                                ">
                                    <Lock size={11} />
                                    Shared securely
                                </div>

                            </div>

                            <div className="
                                mb-6
                                grid
                                grid-cols-2
                                gap-3
                            ">

                                <InfoItem
                                    label="Type"
                                    value={
                                        file.mimeType
                                    }
                                />

                                <InfoItem
                                    label="Size"
                                    value={formatBytes(
                                        Number(
                                            file.size
                                        )
                                    )}
                                />

                                <InfoItem
                                    label="Uploaded"
                                    value={new Date(
                                        file.createdAt
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                />

                                <InfoItem
                                    label="Visibility"
                                    value="Public"
                                />

                            </div>

                            <a
                                href={`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/files/share/${file.shareToken}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    flex
                                    h-12
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-violet-500
                                    text-sm
                                    font-medium
                                    text-white
                                    shadow-lg
                                    shadow-violet-500/10
                                    transition
                                    hover:bg-violet-400
                                    active:scale-[0.99]
                                "
                            >
                                <ArrowDownToLine
                                    size={17}
                                />

                                Download file
                            </a>

                        </div>

                    </div>

                    <p className="
                        mt-6
                        text-center
                        text-[11px]
                        text-zinc-700
                    ">
                        Shared securely with FileHub
                    </p>

                </div>

            </main>
        </div>
    );
};

const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => {
    return (
        <div className="
            rounded-xl
            border
            border-white/[0.05]
            bg-white/[0.02]
            p-3
        ">
            <p className="
                text-[10px]
                uppercase
                tracking-wider
                text-zinc-700
            ">
                {label}
            </p>

            <p className="
                mt-1.5
                truncate
                text-xs
                font-medium
                text-zinc-400
            ">
                {value}
            </p>
        </div>
    );
};

const FileIcon = ({
    mimeType,
    size,
}: {
    mimeType: string;
    size: number;
}) => {
    if (mimeType.startsWith("image/")) {
        return (
            <FileImage
                size={size}
                className="text-emerald-400"
            />
        );
    }

    if (mimeType === "application/pdf") {
        return (
            <FileText
                size={size}
                className="text-red-400"
            />
        );
    }

    if (
        mimeType.includes("zip") ||
        mimeType.includes("compressed")
    ) {
        return (
            <FileArchive
                size={size}
                className="text-amber-400"
            />
        );
    }

    return (
        <File
            size={size}
            className="text-violet-400"
        />
    );
};

const LoadingState = () => {
    return (
        <div
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-[#08090b]
            "
        >
            <div className="text-center">
                <div
                    className="
                        mx-auto
                        mb-4
                        h-8
                        w-8
                        animate-spin
                        rounded-full
                        border-2
                        border-white/[0.08]
                        border-t-violet-400
                    "
                />

                <p
                    className="
                        text-xs
                        text-zinc-600
                    "
                >
                    Loading shared file...
                </p>
            </div>
        </div>
    );
};

const ErrorState = ({
    message,
}: {
    message: string;
}) => {
    return (
        <div className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#08090b]
            px-5
            text-white
        ">

            <div className="
                w-full
                max-w-md
                text-center
            ">

                <div className="
                    mx-auto
                    mb-5
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-red-500/10
                    bg-red-500/[0.05]
                ">
                    <File
                        size={22}
                        className="text-red-400"
                    />
                </div>

                <h1 className="
                    text-xl
                    font-semibold
                ">
                    File unavailable
                </h1>

                <p className="
                    mt-2
                    text-sm
                    leading-6
                    text-zinc-600
                ">
                    {message}
                </p>

                <Link
                    to="/login"
                    className="
                        mt-6
                        inline-flex
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-white/[0.03]
                        px-4
                        py-2.5
                        text-xs
                        font-medium
                        text-zinc-300
                        transition
                        hover:bg-white/[0.06]
                    "
                >
                    Go to FileHub
                </Link>

            </div>

        </div>
    );
};

const formatBytes = (
    bytes: number
) => {
    if (!bytes) return "0 Bytes";

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB",
    ];

    const index = Math.floor(
        Math.log(bytes) /
        Math.log(1024)
    );

    return `${(
        bytes /
        Math.pow(1024, index)
    ).toFixed(
        index === 0 ? 0 : 1
    )} ${units[index]}`;
};

export default SharedFile;