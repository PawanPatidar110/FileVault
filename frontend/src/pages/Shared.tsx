import { useEffect, useMemo, useState } from "react";
import {
    Share2,
    Search,
    Copy,
    Check
} from "lucide-react";

import AppLayout from "../components/layout/AppLayout";
import FileCard from "../components/FileCard";

import {
    getFiles,
    deleteFile,
    downloadFile,
    getFilePreview,
    updateFileStarred,
} from "../api/file.api";

import type { FileItem } from "../types/file";

import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const Shared = () => {
    const {
        toast,
        showToast,
        hideToast,
    } = useToast();

    const [files, setFiles] =
        useState<FileItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [copiedId, setCopiedId] =
        useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Load files
    |--------------------------------------------------------------------------
    */

    const loadFiles = async () => {
        try {
            setLoading(true);

            const data = await getFiles();

            setFiles(data);
        } catch (error) {
            console.error(
                "Failed to load shared files:",
                error
            );

            showToast(
                "error",
                "Failed to load shared files"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Public files only
    |--------------------------------------------------------------------------
    */

    const sharedFiles = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return files.filter((file) => {
            const isPublic =
                file.visibility === "PUBLIC";

            if (!isPublic) {
                return false;
            }

            if (!query) {
                return true;
            }

            return file.originalName
                .toLowerCase()
                .includes(query);
        });
    }, [files, search]);

    /*
    |--------------------------------------------------------------------------
    | Copy share link
    |--------------------------------------------------------------------------
    */

    const handleCopyLink = async (
        file: FileItem
    ) => {
        if (!file.shareToken) {
            showToast(
                "error",
                "Share link is unavailable"
            );

            return;
        }

        const shareUrl =
            `${window.location.origin}/share/${file.shareToken}`;

        try {
            await navigator.clipboard.writeText(
                shareUrl
            );

            setCopiedId(file.id);

            showToast(
                "success",
                "Share link copied"
            );

            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        } catch (error) {
            console.error(
                "Failed to copy share link:",
                error
            );

            showToast(
                "error",
                "Failed to copy share link"
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Download
    |--------------------------------------------------------------------------
    */

    const handleDownload = async (
        file: FileItem
    ) => {
        try {
            const blob =
                await downloadFile(file.id);

            const url =
                URL.createObjectURL(blob);

            const anchor =
                document.createElement("a");

            anchor.href = url;
            anchor.download =
                file.originalName;

            document.body.appendChild(anchor);

            anchor.click();

            anchor.remove();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Download failed:",
                error
            );

            showToast(
                "error",
                "Failed to download file"
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Preview
    |--------------------------------------------------------------------------
    */

    const handlePreview = async (
        file: FileItem
    ) => {
        try {
            const blob =
                await getFilePreview(file.id);

            const url =
                URL.createObjectURL(blob);

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 60000);
        } catch (error) {
            console.error(
                "Preview failed:",
                error
            );

            showToast(
                "error",
                "Unable to preview this file"
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (
        file: FileItem
    ) => {
        const confirmed =
            window.confirm(
                `Delete "${file.originalName}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            await deleteFile(file.id);

            setFiles((current) =>
                current.filter(
                    (item) =>
                        item.id !== file.id
                )
            );

            showToast(
                "success",
                "File deleted successfully"
            );
        } catch (error) {
            console.error(
                "Delete failed:",
                error
            );

            showToast(
                "error",
                "Failed to delete file"
            );
        }
    };

    const handleStar = async (
    file: FileItem
) => {
    try {
        const updatedFile =
            await updateFileStarred(
                file.id,
                !file.isStarred
            );

        setFiles((current) =>
            current.map((item) =>
                item.id === file.id
                    ? {
                          ...item,
                          isStarred:
                              updatedFile.isStarred,
                      }
                    : item
            )
        );

        showToast(
            "success",
            updatedFile.isStarred
                ? "Added to starred"
                : "Removed from starred"
        );
    } catch (error) {
        console.error(
            "Failed to update starred status:",
            error
        );

        showToast(
            "error",
            "Failed to update starred status"
        );
    }
};

    return (
        <AppLayout>

            <div className="p-6 lg:p-8">

                {/* ===================================================== */}
                {/* Header */}
                {/* ===================================================== */}

                <div className="mb-8">

                    <p
                        className="
                            mb-2
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.16em]
                            text-violet-500
                            dark:text-violet-400
                        "
                    >
                        Workspace
                    </p>

                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >
                        <div>

                            <h1
                                className="
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-zinc-900
                                    dark:text-zinc-100
                                "
                            >
                                Shared
                            </h1>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-zinc-500
                                "
                            >
                                Files you've made
                                publicly accessible.
                            </p>

                        </div>

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                text-xs
                                text-zinc-500
                            "
                        >
                            <Share2
                                size={14}
                                className="
                                    text-violet-500
                                    dark:text-violet-400
                                "
                            />

                            {sharedFiles.length}{" "}
                            shared{" "}
                            {sharedFiles.length ===
                            1
                                ? "file"
                                : "files"}
                        </div>
                    </div>

                </div>

                {/* ===================================================== */}
                {/* Search */}
                {/* ===================================================== */}

                <div
                    className="
                        relative
                        mb-5
                        max-w-xl
                    "
                >
                    <Search
                        size={17}
                        className="
                            absolute
                            left-3.5
                            top-1/2
                            -translate-y-1/2
                            text-zinc-400
                            dark:text-zinc-600
                        "
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search shared files..."
                        className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-black/[0.07]
                            bg-white
                            pl-10
                            pr-4
                            text-sm
                            text-zinc-800
                            outline-none
                            placeholder:text-zinc-400
                            transition
                            focus:border-violet-500/40
                            dark:border-white/[0.06]
                            dark:bg-white/[0.025]
                            dark:text-zinc-200
                            dark:placeholder:text-zinc-600
                        "
                    />
                </div>

                {/* ===================================================== */}
                {/* Files */}
                {/* ===================================================== */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-black/[0.07]
                        bg-white
                        dark:border-white/[0.06]
                        dark:bg-white/[0.02]
                    "
                >

                    {/* Loading */}
                    {loading && (
                        <div
                            className="
                                flex
                                min-h-72
                                items-center
                                justify-center
                            "
                        >
                            <div className="text-center">

                                <div
                                    className="
                                        mx-auto
                                        mb-4
                                        h-7
                                        w-7
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-black/[0.08]
                                        border-t-violet-500
                                        dark:border-white/[0.08]
                                        dark:border-t-violet-400
                                    "
                                />

                                <p
                                    className="
                                        text-xs
                                        text-zinc-500
                                    "
                                >
                                    Loading shared files...
                                </p>

                            </div>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading &&
                        sharedFiles.length === 0 && (
                            <div
                                className="
                                    flex
                                    min-h-72
                                    flex-col
                                    items-center
                                    justify-center
                                    px-6
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        mb-4
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-black/[0.07]
                                        bg-zinc-50
                                        dark:border-white/[0.06]
                                        dark:bg-white/[0.03]
                                    "
                                >
                                    <Share2
                                        size={20}
                                        className="
                                            text-zinc-400
                                            dark:text-zinc-600
                                        "
                                    />
                                </div>

                                <h3
                                    className="
                                        text-sm
                                        font-medium
                                        text-zinc-800
                                        dark:text-zinc-200
                                    "
                                >
                                    {search
                                        ? "No shared files found"
                                        : "No shared files"}
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        max-w-sm
                                        text-xs
                                        leading-5
                                        text-zinc-500
                                    "
                                >
                                    {search
                                        ? "Try a different search term."
                                        : "Files that you make public will appear here."}
                                </p>

                            </div>
                        )}

                    {/* File list */}
                    {!loading &&
                        sharedFiles.length > 0 && (
                            <>
                                {/* Header */}
                                <div
                                    className="
                                        hidden
                                        grid-cols-[minmax(220px,2fr)_100px_120px_130px_90px]
                                        gap-4
                                        border-b
                                        border-black/[0.06]
                                        px-5
                                        py-3
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-wider
                                        text-zinc-500
                                        md:grid
                                        dark:border-white/[0.05]
                                        dark:text-zinc-600
                                    "
                                >
                                    <span>Name</span>
                                    <span>Size</span>
                                    <span>
                                        Visibility
                                    </span>
                                    <span>
                                        Modified
                                    </span>
                                    <span />
                                </div>

                                {sharedFiles.map(
                                    (file) => (
                                        <div
                                            key={
                                                file.id
                                            }
                                        >
                                            <FileCard
                                                file={
                                                    file
                                                }
                                                onDownload={
                                                    handleDownload
                                                }
                                                onDelete={
                                                    handleDelete
                                                }
                                                onShare={
                                                    handleCopyLink
                                                }
                                                onPreview={
                                                    handlePreview
                                                }
                                                onStar={handleStar}
                                            />

                                            {/* Share link */}
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    border-b
                                                    border-black/[0.04]
                                                    px-5
                                                    pb-3
                                                    dark:border-white/[0.04]
                                                "
                                            >
                                                <div
                                                    className="
                                                        min-w-0
                                                        flex-1
                                                        rounded-lg
                                                        border
                                                        border-black/[0.06]
                                                        bg-zinc-50
                                                        px-3
                                                        py-2
                                                        dark:border-white/[0.05]
                                                        dark:bg-white/[0.02]
                                                    "
                                                >
                                                    <p
                                                        className="
                                                            truncate
                                                            text-[11px]
                                                            text-zinc-500
                                                            dark:text-zinc-600
                                                        "
                                                    >
                                                        {window.location.origin}
                                                        /share/
                                                        {file.shareToken}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopyLink(
                                                            file
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        shrink-0
                                                        items-center
                                                        gap-1.5
                                                        rounded-lg
                                                        border
                                                        border-black/[0.07]
                                                        bg-white
                                                        px-3
                                                        py-2
                                                        text-[11px]
                                                        font-medium
                                                        text-zinc-600
                                                        transition
                                                        hover:bg-zinc-50
                                                        hover:text-zinc-900
                                                        dark:border-white/[0.06]
                                                        dark:bg-white/[0.03]
                                                        dark:text-zinc-400
                                                        dark:hover:bg-white/[0.06]
                                                        dark:hover:text-zinc-200
                                                    "
                                                >
                                                    {copiedId ===
                                                    file.id ? (
                                                        <>
                                                            <Check
                                                                size={
                                                                    13
                                                                }
                                                            />
                                                            Copied
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy
                                                                size={
                                                                    13
                                                                }
                                                            />
                                                            Copy link
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </>
                        )}

                </div>

            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={hideToast}
                />
            )}

        </AppLayout>
    );
};

export default Shared;