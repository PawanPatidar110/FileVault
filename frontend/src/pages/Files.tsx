import { useEffect, useMemo, useState } from "react";
import {
    Files as FilesIcon,
    Search,
    Upload,
    SlidersHorizontal,
} from "lucide-react";

import AppLayout from "../components/layout/AppLayout";
import FileCard from "../components/FileCard";
import UploadDropzone from "../components/files/UploadDropZone";

import {
    getFiles,
    uploadFile,
    deleteFile,
    downloadFile,
    getFilePreview,
    updateFileStarred,
} from "../api/file.api";

import type {
    FileItem,
    FileVisibility,
} from "../types/file";

import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const Files = () => {
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

    const [showUpload, setShowUpload] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Load Files
    |--------------------------------------------------------------------------
    */

    const loadFiles = async () => {
        try {
            setLoading(true);

            const data = await getFiles();

            setFiles(data);
        } catch (error) {
            console.error(
                "Failed to load files:",
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
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredFiles = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        if (!query) {
            return files;
        }

        return files.filter((file) =>
            file.originalName
                .toLowerCase()
                .includes(query)
        );
    }, [files, search]);

    /*
    |--------------------------------------------------------------------------
    | Upload
    |--------------------------------------------------------------------------
    */

    const handleUpload = async (
        file: File,
        visibility: FileVisibility
    ) => {
        try {
            await uploadFile(
                file,
                visibility
            );

            setShowUpload(false);

            await loadFiles();

            showToast(
                "success",
                "File uploaded successfully"
            );
        } catch (error) {
            console.error(
                "Upload failed:",
                error
            );

            showToast(
                "error",
                "Failed to upload file"
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

            /*
             * Give the browser time to consume
             * the object URL before releasing it.
             */
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

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >
                    <div>

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

                        <h1
                            className="
                                text-3xl
                                font-semibold
                                tracking-tight
                                text-zinc-900
                                dark:text-zinc-100
                            "
                        >
                            My Files
                        </h1>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-zinc-500
                            "
                        >
                            Manage all your uploaded
                            files in one place.
                        </p>

                    </div>

                    {/* Upload button */}
                    <button
                        type="button"
                        onClick={() =>
                            setShowUpload(
                                (current) =>
                                    !current
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-violet-500
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            shadow-lg
                            shadow-violet-500/10
                            transition
                            hover:bg-violet-400
                            active:scale-[0.98]
                        "
                    >
                        <Upload size={16} />
                        Upload file
                    </button>

                </div>

                {/* ===================================================== */}
                {/* Upload */}
                {/* ===================================================== */}

                {showUpload && (
                    <div className="mt-8">
                        <UploadDropzone
                            onUpload={
                                handleUpload
                            }
                            onClose={() =>
                                setShowUpload(
                                    false
                                )
                            }
                        />
                    </div>
                )}

                {/* ===================================================== */}
                {/* Toolbar */}
                {/* ===================================================== */}

                <div
                    className="
                        mt-8
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                    "
                >

                    {/* Search */}
                    <div
                        className="
                            relative
                            flex-1
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
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search files..."
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

                    {/* Filter */}
                    <button
                        type="button"
                        className="
                            inline-flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-black/[0.07]
                            bg-white
                            px-4
                            text-sm
                            text-zinc-600
                            transition
                            hover:bg-zinc-50
                            dark:border-white/[0.06]
                            dark:bg-white/[0.025]
                            dark:text-zinc-400
                            dark:hover:bg-white/[0.04]
                        "
                    >
                        <SlidersHorizontal
                            size={15}
                        />
                        Filter
                    </button>

                </div>

                {/* ===================================================== */}
                {/* Result information */}
                {/* ===================================================== */}

                <div
                    className="
                        mb-3
                        mt-5
                        flex
                        items-center
                        justify-between
                    "
                >
                    <p
                        className="
                            text-xs
                            text-zinc-500
                        "
                    >
                        {filteredFiles.length}{" "}
                        {filteredFiles.length === 1
                            ? "file"
                            : "files"}
                    </p>

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            className="
                                text-xs
                                text-violet-500
                                transition
                                hover:text-violet-400
                            "
                        >
                            Clear search
                        </button>
                    )}
                </div>

                {/* ===================================================== */}
                {/* Files Container */}
                {/* ===================================================== */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-black/[0.07]
                        bg-white
                        transition-colors
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
                                    Loading your files...
                                </p>

                            </div>
                        </div>
                    )}

                    {/* Empty / Search result */}
                    {!loading &&
                        filteredFiles.length === 0 && (
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
                                    <FilesIcon
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
                                        ? "No files found"
                                        : "No files yet"}
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
                                        ? `No files match "${search}".`
                                        : "Upload your first file to get started."}
                                </p>

                                {!search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowUpload(
                                                true
                                            )
                                        }
                                        className="
                                            mt-5
                                            rounded-xl
                                            bg-violet-500
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-violet-400
                                        "
                                    >
                                        Upload your first file
                                    </button>
                                )}

                            </div>
                        )}

                    {/* Files */}
                    {!loading &&
                        filteredFiles.length > 0 && (
                            <>
                                {/* Table header */}
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
                                    <span>
                                        Name
                                    </span>

                                    <span>
                                        Size
                                    </span>

                                    <span>
                                        Visibility
                                    </span>

                                    <span>
                                        Modified
                                    </span>

                                    <span />
                                </div>

                                {filteredFiles.map(
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
                                            onStar={handleStar}
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

export default Files;