import {
    useEffect,
    useState,
} from "react";

import {
    Upload,
    Files,
    HardDrive,
    Share2,
    Copy,
    Check,
    X,
    Download,
    File,
} from "lucide-react";

import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

import AppLayout from "../components/layout/AppLayout";

import {
    getFiles,
    uploadFile,
    deleteFile,
    downloadFile,
    updateFileStarred,
    getFilePreview,
} from "../api/file.api";

import type {
    FileItem,
    FileVisibility,
} from "../types/file";

import { useAuth } from "../context/AuthContext";

import UploadDropzone from "../components/files/UploadDropZone";
import FileCard from "../components/FileCard";

const Dashboard = () => {
    const {
        toast,
        showToast,
        hideToast,
    } = useToast();

    const { user } = useAuth();

    const [files, setFiles] =
        useState<FileItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [showUpload, setShowUpload] =
        useState(false);

    const [shareFile, setShareFile] =
        useState<FileItem | null>(null);

    const [previewFile, setPreviewFile] =
        useState<FileItem | null>(null);

    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);

    const [previewLoading, setPreviewLoading] =
        useState(false);

    const [copied, setCopied] =
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
                "Failed to load files",
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
                "Failed to upload file",
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

        if (!confirmed) return;

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
                "Failed to delete file",
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
                window.URL.createObjectURL(
                    blob
                );

            const anchor =
                document.createElement("a");

            anchor.href = url;
            anchor.download =
                file.originalName;

            document.body.appendChild(anchor);

            anchor.click();

            anchor.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Failed to download file",
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
            setPreviewLoading(true);
            setPreviewFile(file);

            const blob =
                await getFilePreview(file.id);

            const url =
                URL.createObjectURL(blob);

            setPreviewUrl(url);
        } catch (error) {
            console.error(
                "Failed to preview file:",
                error
            );

            setPreviewFile(null);
            setPreviewUrl(null);

            showToast(
                "error",
                "Unable to preview this file"
            );
        } finally {
            setPreviewLoading(false);
        }
    };

    const closePreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(null);
        setPreviewFile(null);
        setPreviewLoading(false);
    };

    /*
    |--------------------------------------------------------------------------
    | Share
    |--------------------------------------------------------------------------
    */

    const handleShare = (
        file: FileItem
    ) => {
        if (!file.shareToken) {
            return;
        }

        setShareFile(file);
        setCopied(false);
    };

    const handleCopyShareLink =
        async () => {
            if (!shareFile?.shareToken) {
                return;
            }

            const shareUrl =
                `${window.location.origin}/share/${shareFile.shareToken}`;

            try {
                await navigator.clipboard.writeText(
                    shareUrl
                );

                setCopied(true);

                showToast(
                    "success",
                    "Share link copied to clipboard"
                );

                setTimeout(() => {
                    setCopied(false);
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
    | Dashboard Stats
    |--------------------------------------------------------------------------
    */

    const sharedFiles =
        files.filter(
            (file) =>
                file.visibility ===
                "PUBLIC"
        ).length;

    const totalBytes =
        files.reduce(
            (total, file) =>
                total +
                Number(file.size),
            0
        );

    return (
        <AppLayout>

            {/* ========================================================= */}
            {/* Header */}
            {/* ========================================================= */}

            <div
                className="
                    mb-8
                    flex
                    flex-col
                    justify-between
                    gap-5
                    sm:flex-row
                    sm:items-end
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
                        Good afternoon,{" "}
                        {user?.name?.split(" ")[0] ??
                            "there"}
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-zinc-500
                            dark:text-zinc-500
                        "
                    >
                        Everything you need,
                        safely stored in one place.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowUpload(
                            (value) => !value
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

            {/* ========================================================= */}
            {/* Upload */}
            {/* ========================================================= */}

            {showUpload && (
                <div className="mb-8">
                    <UploadDropzone
                        onUpload={handleUpload}
                        onClose={() =>
                            setShowUpload(false)
                        }
                    />
                </div>
            )}

            {/* ========================================================= */}
            {/* Stats */}
            {/* ========================================================= */}

            <div
                className="
                    mb-8
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-3
                "
            >
                <StatCard
                    icon={
                        <Files size={18} />
                    }
                    label="Total files"
                    value={String(
                        files.length
                    )}
                    description="Files in your workspace"
                />

                <StatCard
                    icon={
                        <HardDrive
                            size={18}
                        />
                    }
                    label="Storage used"
                    value={formatBytes(
                        totalBytes
                    )}
                    description="Current workspace usage"
                />

                <StatCard
                    icon={
                        <Share2 size={18} />
                    }
                    label="Shared files"
                    value={String(
                        sharedFiles
                    )}
                    description="Currently public"
                />
            </div>

            {/* ========================================================= */}
            {/* Recent Files */}
            {/* ========================================================= */}

            <section>

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        justify-between
                    "
                >
                    <div>

                        <h2
                            className="
                                text-sm
                                font-semibold
                                text-zinc-900
                                dark:text-zinc-200
                            "
                        >
                            Recent files
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-zinc-500
                                dark:text-zinc-600
                            "
                        >
                            Your uploaded files.
                        </p>

                    </div>
                </div>

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
                    {loading ? (
                        <div
                            className="
                                flex
                                min-h-64
                                items-center
                                justify-center
                                text-xs
                                text-zinc-500
                            "
                        >
                            <div className="text-center">

                                <div
                                    className="
                                        mx-auto
                                        mb-3
                                        h-6
                                        w-6
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-black/[0.08]
                                        border-t-violet-500
                                        dark:border-white/[0.08]
                                        dark:border-t-violet-400
                                    "
                                />

                                Loading your files...
                            </div>
                        </div>
                    ) : files.length === 0 ? (

                        <EmptyState
                            onUpload={() =>
                                setShowUpload(true)
                            }
                        />

                    ) : (

                        <>
                            {/* Table Header */}
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

                            {files.map(
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
            </section>

            {/* ========================================================= */}
            {/* Share Modal */}
            {/* ========================================================= */}

            {shareFile && (
                <ShareModal
                    file={shareFile}
                    copied={copied}
                    onCopy={
                        handleCopyShareLink
                    }
                    onClose={() => {
                        setShareFile(null);
                        setCopied(false);
                    }}
                />
            )}

            {/* ========================================================= */}
            {/* Preview Modal */}
            {/* ========================================================= */}

            {previewFile && (
                <PreviewModal
                    file={previewFile}
                    previewUrl={previewUrl}
                    loading={previewLoading}
                    onClose={closePreview}
                    onDownload={
                        handleDownload
                    }
                />
            )}

            {/* ========================================================= */}
            {/* Toast */}
            {/* ========================================================= */}

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

/* ===================================================================== */
/* Stat Card */
/* ===================================================================== */

const StatCard = ({
    icon,
    label,
    value,
    description,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    description: string;
}) => {
    return (
        <div
            className="
                rounded-2xl
                border
                border-black/[0.07]
                bg-white
                p-5
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-black/[0.1]
                hover:shadow-lg
                hover:shadow-black/[0.03]
                dark:border-white/[0.06]
                dark:bg-white/[0.025]
                dark:hover:border-white/[0.09]
                dark:hover:bg-white/[0.035]
            "
        >

            <div
                className="
                    mb-5
                    flex
                    items-center
                    justify-between
                "
            >
                <div
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-violet-500/10
                        text-violet-500
                        dark:text-violet-400
                    "
                >
                    {icon}
                </div>

                <span
                    className="
                        text-[10px]
                        uppercase
                        tracking-wider
                        text-zinc-400
                        dark:text-zinc-700
                    "
                >
                    FileHub
                </span>
            </div>

            <p
                className="
                    text-xs
                    text-zinc-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    text-2xl
                    font-semibold
                    tracking-tight
                    text-zinc-900
                    dark:text-zinc-100
                "
            >
                {value}
            </p>

            <p
                className="
                    mt-2
                    text-[11px]
                    text-zinc-500
                    dark:text-zinc-600
                "
            >
                {description}
            </p>

        </div>
    );
};

/* ===================================================================== */
/* Empty State */
/* ===================================================================== */

const EmptyState = ({
    onUpload,
}: {
    onUpload: () => void;
}) => {
    return (
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
                <Files
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
                    dark:text-zinc-300
                "
            >
                No files yet
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
                Upload your first file and
                it will appear here.
            </p>

            <button
                type="button"
                onClick={onUpload}
                className="
                    mt-5
                    rounded-xl
                    border
                    border-black/[0.08]
                    bg-zinc-50
                    px-4
                    py-2
                    text-xs
                    font-medium
                    text-zinc-700
                    transition
                    hover:bg-zinc-100
                    dark:border-white/[0.08]
                    dark:bg-white/[0.03]
                    dark:text-zinc-300
                    dark:hover:bg-white/[0.06]
                "
            >
                Upload your first file
            </button>

        </div>
    );
};

/* ===================================================================== */
/* Format Bytes */
/* ===================================================================== */

const formatBytes = (
    bytes: number
) => {
    if (!bytes) {
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

/* ===================================================================== */
/* Share Modal */
/* ===================================================================== */

const ShareModal = ({
    file,
    copied,
    onCopy,
    onClose,
}: {
    file: FileItem;
    copied: boolean;
    onCopy: () => void;
    onClose: () => void;
}) => {
    if (!file.shareToken) {
        return null;
    }

    const shareUrl =
        `${window.location.origin}/share/${file.shareToken}`;

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/60
                px-4
                backdrop-blur-sm
                dark:bg-black/70
            "
            onClick={onClose}
        >
            <div
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-2xl
                    border
                    border-black/[0.08]
                    bg-white
                    shadow-2xl
                    shadow-black/20
                    dark:border-white/[0.08]
                    dark:bg-[#111216]
                    dark:shadow-black/40
                "
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* Header */}
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        border-b
                        border-black/[0.06]
                        px-6
                        py-5
                        dark:border-white/[0.06]
                    "
                >
                    <div>

                        <div
                            className="
                                mb-2
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-violet-500/10
                                text-violet-500
                                dark:text-violet-400
                            "
                        >
                            <Share2 size={18} />
                        </div>

                        <h2
                            className="
                                text-base
                                font-semibold
                                text-zinc-900
                                dark:text-zinc-100
                            "
                        >
                            Share file
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-zinc-500
                            "
                        >
                            Anyone with this link can
                            access this public file.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-zinc-400
                            transition
                            hover:bg-black/[0.04]
                            hover:text-zinc-800
                            dark:text-zinc-500
                            dark:hover:bg-white/[0.05]
                            dark:hover:text-zinc-200
                        "
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* File */}
                <div className="px-6 pt-5">

                    <div
                        className="
                            rounded-xl
                            border
                            border-black/[0.07]
                            bg-zinc-50
                            px-4
                            py-3
                            dark:border-white/[0.06]
                            dark:bg-white/[0.025]
                        "
                    >
                        <p
                            className="
                                truncate
                                text-sm
                                font-medium
                                text-zinc-800
                                dark:text-zinc-200
                            "
                            title={file.originalName}
                        >
                            {file.originalName}
                        </p>

                        <p
                            className="
                                mt-1
                                text-[11px]
                                text-zinc-500
                            "
                        >
                            Public file
                        </p>
                    </div>

                </div>

                {/* Share URL */}
                <div className="px-6 py-5">

                    <label
                        className="
                            mb-2
                            block
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-wider
                            text-zinc-500
                        "
                    >
                        Share link
                    </label>

                    <div
                        className="
                            flex
                            overflow-hidden
                            rounded-xl
                            border
                            border-black/[0.08]
                            bg-zinc-50
                            dark:border-white/[0.08]
                            dark:bg-black/20
                        "
                    >

                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="
                                min-w-0
                                flex-1
                                bg-transparent
                                px-3
                                py-3
                                text-xs
                                text-zinc-500
                                outline-none
                                dark:text-zinc-400
                            "
                            onFocus={(event) =>
                                event.target.select()
                            }
                        />

                        <button
                            type="button"
                            onClick={onCopy}
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-2
                                border-l
                                border-black/[0.08]
                                bg-white
                                px-4
                                text-xs
                                font-medium
                                text-zinc-600
                                transition
                                hover:bg-violet-500/10
                                hover:text-violet-600
                                dark:border-white/[0.08]
                                dark:bg-white/[0.03]
                                dark:text-zinc-300
                                dark:hover:text-violet-300
                            "
                        >
                            {copied ? (
                                <>
                                    <Check
                                        size={14}
                                    />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy
                                        size={14}
                                    />
                                    Copy
                                </>
                            )}
                        </button>

                    </div>

                    {copied && (
                        <p
                            className="
                                mt-2
                                flex
                                items-center
                                gap-1.5
                                text-[11px]
                                text-emerald-500
                                dark:text-emerald-400
                            "
                        >
                            <Check size={12} />
                            Link copied to clipboard
                        </p>
                    )}

                </div>

                {/* Footer */}
                <div
                    className="
                        flex
                        justify-end
                        border-t
                        border-black/[0.06]
                        px-6
                        py-4
                        dark:border-white/[0.06]
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-xl
                            border
                            border-black/[0.08]
                            bg-zinc-50
                            px-4
                            py-2
                            text-xs
                            font-medium
                            text-zinc-700
                            transition
                            hover:bg-zinc-100
                            dark:border-white/[0.08]
                            dark:bg-white/[0.03]
                            dark:text-zinc-300
                            dark:hover:bg-white/[0.06]
                        "
                    >
                        Done
                    </button>
                </div>

            </div>
        </div>
    );
};

/* ===================================================================== */
/* Preview Modal */
/* ===================================================================== */

const PreviewModal = ({
    file,
    previewUrl,
    loading,
    onClose,
    onDownload,
}: {
    file: FileItem;
    previewUrl: string | null;
    loading: boolean;
    onClose: () => void;
    onDownload: (
        file: FileItem
    ) => void;
}) => {
    const isImage =
        file.mimeType.startsWith(
            "image/"
        );

    const isPdf =
        file.mimeType ===
        "application/pdf";

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/70
                px-4
                py-6
                backdrop-blur-sm
                dark:bg-black/80
            "
            onClick={onClose}
        >
            <div
                className="
                    flex
                    max-h-[90vh]
                    w-full
                    max-w-5xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-black/[0.08]
                    bg-white
                    shadow-2xl
                    shadow-black/30
                    dark:border-white/[0.08]
                    dark:bg-[#111216]
                    dark:shadow-black/50
                "
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* Header */}
                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-black/[0.06]
                        px-5
                        py-4
                        dark:border-white/[0.06]
                    "
                >
                    <div className="min-w-0">

                        <p
                            className="
                                truncate
                                text-sm
                                font-medium
                                text-zinc-900
                                dark:text-zinc-200
                            "
                            title={
                                file.originalName
                            }
                        >
                            {file.originalName}
                        </p>

                        <p
                            className="
                                mt-1
                                text-[11px]
                                text-zinc-500
                            "
                        >
                            {file.mimeType}
                            {" · "}
                            {formatBytes(
                                Number(
                                    file.size
                                )
                            )}
                        </p>

                    </div>

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                        "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                onDownload(
                                    file
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-violet-500
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-white
                                transition
                                hover:bg-violet-400
                                active:scale-[0.98]
                            "
                        >
                            <Download size={14} />
                            Download
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-xl
                                p-2
                                text-zinc-400
                                transition
                                hover:bg-black/[0.04]
                                hover:text-zinc-800
                                dark:text-zinc-500
                                dark:hover:bg-white/[0.05]
                                dark:hover:text-zinc-200
                            "
                            title="Close preview"
                        >
                            <X size={17} />
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div
                    className="
                        flex
                        min-h-[400px]
                        flex-1
                        items-center
                        justify-center
                        overflow-auto
                        bg-zinc-100
                        p-6
                        dark:bg-black/30
                    "
                >

                    {/* Loading */}
                    {loading && (
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
                                Loading preview...
                            </p>

                        </div>
                    )}

                    {/* Image */}
                    {!loading &&
                        previewUrl &&
                        isImage && (
                            <img
                                src={previewUrl}
                                alt={
                                    file.originalName
                                }
                                className="
                                    max-h-[70vh]
                                    max-w-full
                                    rounded-xl
                                    object-contain
                                    shadow-2xl
                                "
                            />
                        )}

                    {/* PDF */}
                    {!loading &&
                        previewUrl &&
                        isPdf && (
                            <iframe
                                src={previewUrl}
                                title={
                                    file.originalName
                                }
                                className="
                                    h-[70vh]
                                    w-full
                                    rounded-xl
                                    border-0
                                    bg-white
                                "
                            />
                        )}

                    {/* Unsupported */}
                    {!loading &&
                        !isImage &&
                        !isPdf && (
                            <UnsupportedPreview
                                file={file}
                                onDownload={
                                    onDownload
                                }
                            />
                        )}

                    {/* Preview failed */}
                    {!loading &&
                        (isImage ||
                            isPdf) &&
                        !previewUrl && (
                            <div className="text-center">

                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-16
                                        w-16
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-red-500/10
                                        text-red-500
                                        dark:text-red-400
                                    "
                                >
                                    <File size={28} />
                                </div>

                                <h3
                                    className="
                                        mt-4
                                        text-sm
                                        font-medium
                                        text-zinc-800
                                        dark:text-zinc-200
                                    "
                                >
                                    Preview unavailable
                                </h3>

                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        text-zinc-500
                                    "
                                >
                                    We couldn't load
                                    this file preview.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDownload(
                                            file
                                        )
                                    }
                                    className="
                                        mt-5
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-black/[0.08]
                                        bg-white
                                        px-4
                                        py-2
                                        text-xs
                                        font-medium
                                        text-zinc-700
                                        transition
                                        hover:bg-zinc-50
                                        dark:border-white/[0.08]
                                        dark:bg-white/[0.03]
                                        dark:text-zinc-300
                                        dark:hover:bg-white/[0.06]
                                    "
                                >
                                    <Download
                                        size={14}
                                    />
                                    Download instead
                                </button>

                            </div>
                        )}

                </div>

            </div>
        </div>
    );
};

/* ===================================================================== */
/* Unsupported Preview */
/* ===================================================================== */

const UnsupportedPreview = ({
    file,
    onDownload,
}: {
    file: FileItem;
    onDownload: (
        file: FileItem
    ) => void;
}) => {
    return (
        <div
            className="
                flex
                max-w-md
                flex-col
                items-center
                text-center
            "
        >

            {/* Icon */}
            <div
                className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-3xl
                    bg-violet-500/10
                    text-violet-500
                    dark:text-violet-400
                "
            >
                <File size={34} />
            </div>

            {/* Title */}
            <h3
                className="
                    mt-5
                    text-sm
                    font-medium
                    text-zinc-800
                    dark:text-zinc-200
                "
            >
                Preview unavailable
            </h3>

            {/* Description */}
            <p
                className="
                    mt-2
                    text-xs
                    leading-5
                    text-zinc-500
                "
            >
                This file type cannot be
                previewed directly in your
                browser.
            </p>

            {/* File Information */}
            <div
                className="
                    mt-5
                    w-full
                    rounded-xl
                    border
                    border-black/[0.07]
                    bg-zinc-50
                    px-4
                    py-3
                    text-left
                    dark:border-white/[0.06]
                    dark:bg-white/[0.025]
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >
                    <span
                        className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-zinc-400
                            dark:text-zinc-700
                        "
                    >
                        File type
                    </span>

                    <span
                        className="
                            max-w-[220px]
                            truncate
                            text-xs
                            text-zinc-500
                            dark:text-zinc-400
                        "
                        title={file.mimeType}
                    >
                        {file.mimeType}
                    </span>
                </div>

                <div
                    className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >
                    <span
                        className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-zinc-400
                            dark:text-zinc-700
                        "
                    >
                        Size
                    </span>

                    <span
                        className="
                            text-xs
                            text-zinc-500
                            dark:text-zinc-400
                        "
                    >
                        {formatBytes(
                            Number(
                                file.size
                            )
                        )}
                    </span>
                </div>

            </div>

            {/* Download */}
            <button
                type="button"
                onClick={() =>
                    onDownload(file)
                }
                className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-violet-500
                    px-4
                    py-2.5
                    text-xs
                    font-medium
                    text-white
                    shadow-lg
                    shadow-violet-500/10
                    transition
                    hover:bg-violet-400
                    active:scale-[0.98]
                "
            >
                <Download size={14} />
                Download file
            </button>

        </div>
    );
};

export default Dashboard;