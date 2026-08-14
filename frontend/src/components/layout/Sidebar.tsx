import {
    Cloud,
    Files,
    LayoutDashboard,
    Share2,
    Star,
    Settings,
    LogOut,
    HardDrive,
    X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
    NavLink,
} from "react-router-dom";

interface SidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

const Sidebar = ({
    mobileOpen = false,
    onMobileClose,
}: SidebarProps) => {
    const { user, logout } = useAuth();

    return (
        <>
            {/* ===================================================== */}
            {/* Mobile Overlay */}
            {/* ===================================================== */}

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onMobileClose}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        backdrop-blur-[2px]
                        lg:hidden
                    "
                />
            )}

            {/* ===================================================== */}
            {/* Sidebar */}
            {/* ===================================================== */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    h-screen
                    w-64
                    shrink-0
                    flex-col
                    border-r
                    border-black/[0.07]
                    bg-white
                    shadow-2xl
                    transition-transform
                    duration-200
                    dark:border-white/[0.06]
                    dark:bg-[#0b0c0f]
                    lg:translate-x-0
                    lg:shadow-none

                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* ================================================= */}
                {/* Logo */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        h-20
                        shrink-0
                        items-center
                        justify-between
                        px-6
                    "
                >

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                bg-violet-500
                                shadow-lg
                                shadow-violet-500/20
                            "
                        >
                            <Cloud
                                size={19}
                                strokeWidth={2.2}
                                className="text-white"
                            />
                        </div>

                        <div>

                            <h1
                                className="
                                    text-[15px]
                                    font-semibold
                                    tracking-tight
                                    text-zinc-900
                                    dark:text-white
                                "
                            >
                                FileHub
                            </h1>

                            <p
                                className="
                                    text-[10px]
                                    uppercase
                                    tracking-[0.18em]
                                    text-zinc-500
                                    dark:text-zinc-600
                                "
                            >
                                Personal storage
                            </p>

                        </div>

                    </div>

                    {/* Mobile close */}
                    <button
                        type="button"
                        onClick={onMobileClose}
                        className="
                            rounded-lg
                            p-2
                            text-zinc-500
                            transition
                            hover:bg-black/[0.04]
                            hover:text-zinc-800
                            dark:hover:bg-white/[0.05]
                            dark:hover:text-zinc-200
                            lg:hidden
                        "
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* ================================================= */}
                {/* Navigation */}
                {/* ================================================= */}

                <nav className="flex-1 overflow-y-auto px-3 py-4">

                    <p
                        className="
                            mb-3
                            px-3
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-zinc-500
                            dark:text-zinc-600
                        "
                    >
                        Workspace
                    </p>

                    <div className="space-y-1">

                        <SidebarItem
                            to="/dashboard"
                            icon={
                                <LayoutDashboard
                                    size={17}
                                />
                            }
                            label="Dashboard"
                            onNavigate={onMobileClose}
                        />

                        <SidebarItem
                            to="/files"
                            icon={
                                <Files size={17} />
                            }
                            label="My Files"
                            onNavigate={onMobileClose}
                        />

                        <SidebarItem
                            to="/shared"
                            icon={
                                <Share2 size={17} />
                            }
                            label="Shared"
                            onNavigate={onMobileClose}
                        />

                        <SidebarItem
                            to="/starred"
                            icon={
                                <Star size={17} />
                            }
                            label="Starred"
                            onNavigate={onMobileClose}
                        />

                    </div>

                    <p
                        className="
                            mb-3
                            mt-8
                            px-3
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-zinc-500
                            dark:text-zinc-600
                        "
                    >
                        Settings
                    </p>

                    <SidebarItem
                        to="/settings"
                        icon={
                            <Settings size={17} />
                        }
                        label="Settings"
                        onNavigate={onMobileClose}
                    />

                </nav>

                {/* ================================================= */}
                {/* Storage */}
                {/* ================================================= */}

                <div className="px-4 pb-4">

                    <div
                        className="
                            rounded-2xl
                            border
                            border-black/[0.07]
                            bg-zinc-50
                            p-4
                            dark:border-white/[0.06]
                            dark:bg-white/[0.025]
                        "
                    >

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <HardDrive
                                    size={15}
                                    className="
                                        text-zinc-400
                                    "
                                />

                                <span
                                    className="
                                        text-xs
                                        font-medium
                                        text-zinc-700
                                        dark:text-zinc-300
                                    "
                                >
                                    Storage
                                </span>
                            </div>

                            <span
                                className="
                                    text-[10px]
                                    text-zinc-500
                                    dark:text-zinc-600
                                "
                            >
                                24%
                            </span>

                        </div>

                        <div
                            className="
                                mb-2
                                h-1.5
                                overflow-hidden
                                rounded-full
                                bg-black/[0.06]
                                dark:bg-white/[0.06]
                            "
                        >
                            <div
                                className="
                                    h-full
                                    w-[24%]
                                    rounded-full
                                    bg-violet-500
                                "
                            />
                        </div>

                        <p
                            className="
                                text-[11px]
                                text-zinc-500
                                dark:text-zinc-600
                            "
                        >
                            2.4 GB of 10 GB used
                        </p>

                    </div>

                </div>

                {/* ================================================= */}
                {/* User */}
                {/* ================================================= */}

                <div
                    className="
                        border-t
                        border-black/[0.07]
                        p-3
                        dark:border-white/[0.06]
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2.5
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-violet-500/15
                                text-xs
                                font-semibold
                                text-violet-500
                                dark:text-violet-300
                            "
                        >
                            {user?.name
                                ?.charAt(0)
                                .toUpperCase() ?? "U"}
                        </div>

                        <div className="min-w-0 flex-1">

                            <p
                                className="
                                    truncate
                                    text-xs
                                    font-medium
                                    text-zinc-800
                                    dark:text-zinc-200
                                "
                            >
                                {user?.name ?? "User"}
                            </p>

                            <p
                                className="
                                    truncate
                                    text-[10px]
                                    text-zinc-500
                                    dark:text-zinc-600
                                "
                            >
                                {user?.email ?? ""}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="
                                rounded-lg
                                p-2
                                text-zinc-500
                                transition
                                hover:bg-black/[0.04]
                                hover:text-zinc-800
                                dark:text-zinc-600
                                dark:hover:bg-white/[0.05]
                                dark:hover:text-zinc-300
                            "
                            title="Log out"
                        >
                            <LogOut size={15} />
                        </button>

                    </div>

                </div>

            </aside>
        </>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    to: string;
    onNavigate?: () => void;
}

const SidebarItem = ({
    icon,
    label,
    to,
    onNavigate,
}: SidebarItemProps) => {
    return (
        <NavLink
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
                `
                group
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-left
                text-sm
                transition-all
                duration-150

                ${
                    isActive
                        ? `
                            bg-violet-500/[0.08]
                            text-zinc-900
                            dark:bg-white/[0.07]
                            dark:text-white
                        `
                        : `
                            text-zinc-500
                            hover:bg-black/[0.035]
                            hover:text-zinc-900
                            dark:text-zinc-500
                            dark:hover:bg-white/[0.035]
                            dark:hover:text-zinc-200
                        `
                }
            `
            }
        >
            {({ isActive }) => (
                <>
                    <span
                        className={
                            isActive
                                ? "text-violet-500 dark:text-violet-400"
                                : "text-zinc-500 dark:text-zinc-600 group-hover:text-zinc-400"
                        }
                    >
                        {icon}
                    </span>

                    <span>
                        {label}
                    </span>

                    {isActive && (
                        <span
                            className="
                                ml-auto
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-violet-500
                                dark:bg-violet-400
                            "
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};

export default Sidebar;