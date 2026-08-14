import {
    Archive,
    Download,
    File,
    FileImage,
    FileText,
    MoreHorizontal,
    Share2,
    Trash2,
    Lock,
    Globe,
    Star,
    Eye,
} from "lucide-react";

import type { FileItem } from "../types/file";

interface FileCardProps {
    file: FileItem;
    onDownload: (file: FileItem) => void;
    onDelete: (file: FileItem) => void;
    onShare: (file: FileItem) => void;
    onPreview: (file: FileItem) => void;
    onStar: (file: FileItem) => void;
}

const FileCard = ({
    file,
    onDownload,
    onDelete,
    onShare,
    onPreview,
    onStar,
}: FileCardProps) => {
    const extension =
        file.originalName
            .split(".")
            .pop()
            ?.toLowerCase();

    const getIcon = () => {
        if (
            ["jpg", "jpeg", "png", "gif", "webp"].includes(
                extension ?? ""
            )
        ) {
            return (
                <FileImage
                    size={19}
                    className="text-emerald-400"
                />
            );
        }

        if (
            ["pdf", "doc", "docx", "txt"].includes(
                extension ?? ""
            )
        ) {
            return (
                <FileText
                    size={19}
                    className="text-red-400"
                />
            );
        }

        if (
            ["zip", "rar", "7z"].includes(
                extension ?? ""
            )
        ) {
            return (
                <Archive
                    size={19}
                    className="text-amber-400"
                />
            );
        }

        return (
            <File
                size={19}
                className="text-violet-400"
            />
        );
    };

    const formattedDate = new Date(
        file.createdAt
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <>
            {/* ===================================================== */}
            {/* Desktop */}
            {/* ===================================================== */}

            <div
                className="
                    group
                    hidden
                    grid-cols-[minmax(220px,2fr)_100px_120px_130px_150px]
                    items-center
                    gap-4
                    border-b
                    border-black/[0.05]
                    px-5
                    py-4
                    transition
                    last:border-0
                    hover:bg-black/[0.015]
                    md:grid
                    dark:border-white/[0.04]
                    dark:hover:bg-white/[0.025]
                "
            >

                {/* File */}
                <FileInfo
                    file={file}
                    getIcon={getIcon}
                />

                {/* Size */}
                <span
                    className="
                        text-xs
                        text-zinc-500
                    "
                >
                    {formatBytes(
                        Number(file.size)
                    )}
                </span>

                {/* Visibility */}
                <Visibility
                    visibility={
                        file.visibility
                    }
                />

                {/* Date */}
                <span
                    className="
                        text-xs
                        text-zinc-500
                    "
                >
                    {formattedDate}
                </span>

                {/* Actions */}
                <FileActions
                    file={file}
                    onPreview={onPreview}
                    onDownload={onDownload}
                    onShare={onShare}
                    onStar={onStar}
                    onDelete={onDelete}
                />

            </div>

            {/* ===================================================== */}
            {/* Mobile */}
            {/* ===================================================== */}

            <div
                className="
                    border-b
                    border-black/[0.05]
                    p-4
                    last:border-0
                    dark:border-white/[0.04]
                    md:hidden
                "
            >

                <div className="flex items-start gap-3">

                    {/* Icon */}
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-black/[0.06]
                            bg-zinc-50
                            dark:border-white/[0.06]
                            dark:bg-white/[0.025]
                        "
                    >
                        {getIcon()}
                    </div>

                    {/* File information */}
                    <div className="min-w-0 flex-1">

                        <div className="flex items-start gap-2">

                            <p
                                className="
                                    min-w-0
                                    flex-1
                                    truncate
                                    text-sm
                                    font-medium
                                    text-zinc-800
                                    dark:text-zinc-200
                                "
                            >
                                {file.originalName}
                            </p>

                            {file.isStarred && (
                                <Star
                                    size={14}
                                    className="
                                        shrink-0
                                        fill-amber-400
                                        text-amber-400
                                    "
                                />
                            )}

                        </div>

                        <p
                            className="
                                mt-0.5
                                truncate
                                text-[11px]
                                text-zinc-500
                            "
                        >
                            {file.mimeType}
                        </p>

                        <div
                            className="
                                mt-2
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    text-[11px]
                                    text-zinc-500
                                "
                            >
                                {formatBytes(
                                    Number(file.size)
                                )}
                            </span>

                            <span
                                className="
                                    text-zinc-300
                                    dark:text-zinc-700
                                "
                            >
                                •
                            </span>

                            <Visibility
                                visibility={
                                    file.visibility
                                }
                            />

                            <span
                                className="
                                    text-zinc-300
                                    dark:text-zinc-700
                                "
                            >
                                •
                            </span>

                            <span
                                className="
                                    text-[11px]
                                    text-zinc-500
                                "
                            >
                                {formattedDate}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Mobile actions */}
                <div
                    className="
                        mt-3
                        grid
                        grid-cols-4
                        gap-2
                    "
                >

                    <MobileAction
                        icon={<Eye size={15} />}
                        label="Preview"
                        onClick={() =>
                            onPreview(file)
                        }
                    />

                    <MobileAction
                        icon={<Download size={15} />}
                        label="Download"
                        onClick={() =>
                            onDownload(file)
                        }
                    />

                    <MobileAction
                        icon={
                            <Star
                                size={15}
                                className={
                                    file.isStarred
                                        ? "fill-amber-400 text-amber-400"
                                        : ""
                                }
                            />
                        }
                        label={
                            file.isStarred
                                ? "Starred"
                                : "Star"
                        }
                        onClick={() =>
                            onStar(file)
                        }
                    />

                    {file.visibility === "PUBLIC" ? (
                        <MobileAction
                            icon={
                                <Share2
                                    size={15}
                                />
                            }
                            label="Share"
                            onClick={() =>
                                onShare(file)
                            }
                        />
                    ) : (
                        <MobileAction
                            icon={
                                <Trash2
                                    size={15}
                                />
                            }
                            label="Delete"
                            danger
                            onClick={() =>
                                onDelete(file)
                            }
                        />
                    )}

                </div>

                {/* Delete for public files */}
                {file.visibility === "PUBLIC" && (
                    <button
                        type="button"
                        onClick={() =>
                            onDelete(file)
                        }
                        className="
                            mt-2
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            py-2
                            text-[11px]
                            text-zinc-500
                            transition
                            hover:bg-red-500/[0.06]
                            hover:text-red-400
                            dark:text-zinc-600
                        "
                    >
                        <Trash2 size={13} />
                        Delete file
                    </button>
                )}

            </div>
        </>
    );
};

/* ================================================================ */
/* File Info */
/* ================================================================ */

interface FileInfoProps {
    file: FileItem;
    getIcon: () => React.ReactNode;
}

const FileInfo = ({
    file,
    getIcon,
}: FileInfoProps) => {
    return (
        <div className="flex min-w-0 items-center gap-3">

            <div
                className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-black/[0.06]
                    bg-zinc-50
                    dark:border-white/[0.06]
                    dark:bg-white/[0.025]
                "
            >
                {getIcon()}
            </div>

            <div className="min-w-0">

                <div className="flex min-w-0 items-center gap-2">

                    <p
                        className="
                            truncate
                            text-sm
                            font-medium
                            text-zinc-800
                            dark:text-zinc-200
                        "
                    >
                        {file.originalName}
                    </p>

                    {file.isStarred && (
                        <Star
                            size={13}
                            className="
                                shrink-0
                                fill-amber-400
                                text-amber-400
                            "
                        />
                    )}

                </div>

                <p
                    className="
                        mt-0.5
                        truncate
                        text-[11px]
                        text-zinc-500
                        dark:text-zinc-600
                    "
                >
                    {file.mimeType}
                </p>

            </div>

        </div>
    );
};

/* ================================================================ */
/* Visibility */
/* ================================================================ */

const Visibility = ({
    visibility,
}: {
    visibility: "PUBLIC" | "PRIVATE";
}) => {
    if (visibility === "PUBLIC") {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-emerald-500/[0.08]
                    px-2.5
                    py-1.5
                    text-[11px]
                    font-medium
                    text-emerald-500
                    dark:text-emerald-400
                "
            >
                <Globe size={12} />
                Public
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-black/[0.04]
                px-2.5
                py-1.5
                text-[11px]
                font-medium
                text-zinc-500
                dark:bg-white/[0.05]
                dark:text-zinc-500
            "
        >
            <Lock size={12} />
            Private
        </span>
    );
};

/* ================================================================ */
/* Desktop Actions */
/* ================================================================ */

interface FileActionsProps {
    file: FileItem;
    onPreview: (file: FileItem) => void;
    onDownload: (file: FileItem) => void;
    onShare: (file: FileItem) => void;
    onStar: (file: FileItem) => void;
    onDelete: (file: FileItem) => void;
}

const FileActions = ({
    file,
    onPreview,
    onDownload,
    onShare,
    onStar,
    onDelete,
}: FileActionsProps) => {
    return (
        <div
            className="
                flex
                items-center
                justify-end
                gap-1
                opacity-0
                transition
                group-hover:opacity-100
            "
        >

            <ActionButton
                title="Preview"
                onClick={() =>
                    onPreview(file)
                }
            >
                <Eye size={15} />
            </ActionButton>

            <ActionButton
                title="Download"
                onClick={() =>
                    onDownload(file)
                }
            >
                <Download size={15} />
            </ActionButton>

            <ActionButton
                title={
                    file.isStarred
                        ? "Remove from starred"
                        : "Add to starred"
                }
                onClick={() =>
                    onStar(file)
                }
            >
                <Star
                    size={15}
                    className={
                        file.isStarred
                            ? "fill-amber-400 text-amber-400"
                            : ""
                    }
                />
            </ActionButton>

            {file.visibility === "PUBLIC" && (
                <ActionButton
                    title="Copy share link"
                    onClick={() =>
                        onShare(file)
                    }
                >
                    <Share2 size={15} />
                </ActionButton>
            )}

            <ActionButton
                title="Delete"
                danger
                onClick={() =>
                    onDelete(file)
                }
            >
                <Trash2 size={15} />
            </ActionButton>

            <ActionButton
                title="More"
                onClick={() => {}}
            >
                <MoreHorizontal size={15} />
            </ActionButton>

        </div>
    );
};

/* ================================================================ */
/* Desktop Action Button */
/* ================================================================ */

interface ActionButtonProps {
    children: React.ReactNode;
    title: string;
    danger?: boolean;
    onClick: () => void;
}

const ActionButton = ({
    children,
    title,
    danger = false,
    onClick,
}: ActionButtonProps) => {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`
                rounded-lg
                p-2
                transition
                ${
                    danger
                        ? `
                            text-zinc-500
                            hover:bg-red-500/[0.08]
                            hover:text-red-400
                        `
                        : `
                            text-zinc-500
                            hover:bg-black/[0.04]
                            hover:text-zinc-900
                            dark:hover:bg-white/[0.06]
                            dark:hover:text-zinc-200
                        `
                }
            `}
        >
            {children}
        </button>
    );
};

/* ================================================================ */
/* Mobile Action */
/* ================================================================ */

interface MobileActionProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    danger?: boolean;
}

const MobileAction = ({
    icon,
    label,
    onClick,
    danger = false,
}: MobileActionProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex
                min-w-0
                flex-col
                items-center
                justify-center
                gap-1
                rounded-xl
                border
                py-2.5
                transition

                ${
                    danger
                        ? `
                            border-red-500/10
                            bg-red-500/[0.04]
                            text-red-400
                            hover:bg-red-500/[0.08]
                        `
                        : `
                            border-black/[0.06]
                            bg-zinc-50
                            text-zinc-500
                            hover:bg-black/[0.04]
                            dark:border-white/[0.05]
                            dark:bg-white/[0.025]
                            dark:text-zinc-500
                            dark:hover:bg-white/[0.05]
                        `
                }
            `}
        >
            {icon}

            <span className="truncate text-[10px]">
                {label}
            </span>
        </button>
    );
};

/* ================================================================ */
/* Format Bytes */
/* ================================================================ */

const formatBytes = (
    bytes: number
) => {
    if (bytes === 0) {
        return "0 Bytes";
    }

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

export default FileCard;