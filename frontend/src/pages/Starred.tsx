import { useEffect, useMemo, useState } from "react";
import {
    Star,
    Search
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

const Starred = () => {
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
                "Failed to load starred files:",
                error
            );

            showToast(
                "error",
                "Failed to load files"
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
    | Starred + Search
    |--------------------------------------------------------------------------
    */

    const starredFiles = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return files.filter((file) => {
            if (!file.isStarred) {
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
    | Star / Unstar
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Share
    |--------------------------------------------------------------------------
    */

    const handleShare = async (
        file: FileItem
    ) => {
        if (!file.shareToken) {
            showToast(
                "error",
                "This file is private"
            );

            return;
        }

        const shareUrl =
            `${window.location.origin}/share/${file.shareToken}`;

        try {
            await navigator.clipboard.writeText(
                shareUrl
            );

            showToast(
                "success",
                "Share link copied"
            );
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
                            gap-3
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >
                        <div>

                            <h1
                                className="
                                    flex
                                    items-center
                                    gap-2.5
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-zinc-900
                                    dark:text-zinc-100
                                "
                            >
                                <Star
                                    size={26}
                                    className="
                                        fill-amber-400
                                        text-amber-400
                                    "
                                />
                                Starred
                            </h1>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-zinc-500
                                "
                            >
                                Quick access to the
                                files that matter most.
                            </p>

                        </div>

                        <p
                            className="
                                text-xs
                                text-zinc-500
                            "
                        >
                            {starredFiles.length}{" "}
                            {starredFiles.length ===
                            1
                                ? "starred file"
                                : "starred files"}
                        </p>

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
                        placeholder="Search starred files..."
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
                {/* File Container */}
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
                                    Loading starred files...
                                </p>

                            </div>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading &&
                        starredFiles.length === 0 && (
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
                                        border-amber-500/10
                                        bg-amber-500/10
                                    "
                                >
                                    <Star
                                        size={21}
                                        className="
                                            text-amber-400
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
                                        ? "No starred files found"
                                        : "No starred files"}
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
                                        : "Star important files and they will appear here."}
                                </p>

                            </div>
                        )}

                    {/* Files */}
                    {!loading &&
                        starredFiles.length > 0 && (
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

                                {starredFiles.map(
                                    (file) => (
                                        <FileCard
                                            key={
                                                file.id
                                            }
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
                                                handleShare
                                            }
                                            onPreview={
                                                handlePreview
                                            }
                                            onStar={
                                                handleStar
                                            }
                                        />
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

export default Starred;