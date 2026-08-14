import {
    Bell,
    Menu,
    Moon,
    Search,
    Sun,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

interface TopbarProps {
    onMenuClick?: () => void;
}

const Topbar = ({
    onMenuClick,
}: TopbarProps) => {
    const { user } = useAuth();

    const {
        theme,
        toggleTheme,
    } = useTheme();

    return (
        <header
            className="
                sticky
                top-0
                z-30
                flex
                h-20
                items-center
                justify-between
                border-b
                border-black/[0.07]
                bg-zinc-50/90
                px-4
                backdrop-blur-xl
                dark:border-white/[0.06]
                dark:bg-[#08090b]/90
                sm:px-6
                lg:px-8
            "
        >

            {/* ===================================================== */}
            {/* Left */}
            {/* ===================================================== */}

            <div className="flex min-w-0 flex-1 items-center gap-3">

                {/* Mobile menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="
                        shrink-0
                        rounded-xl
                        p-2.5
                        text-zinc-500
                        transition
                        hover:bg-black/[0.04]
                        hover:text-zinc-900
                        dark:hover:bg-white/[0.05]
                        dark:hover:text-zinc-200
                        lg:hidden
                    "
                    aria-label="Open sidebar"
                >
                    <Menu size={19} />
                </button>

                {/* Search */}
                <div
                    className="
                        relative
                        hidden
                        w-full
                        max-w-md
                        md:block
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
                        placeholder="Search files..."
                        className="
                            h-10
                            w-full
                            rounded-xl
                            border
                            border-black/[0.07]
                            bg-white
                            pl-10
                            pr-16
                            text-sm
                            text-zinc-800
                            outline-none
                            placeholder:text-zinc-400
                            transition
                            focus:border-violet-500/30
                            focus:bg-white
                            dark:border-white/[0.06]
                            dark:bg-white/[0.025]
                            dark:text-zinc-200
                            dark:placeholder:text-zinc-600
                            dark:focus:bg-white/[0.04]
                        "
                    />

                    <div
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            rounded-md
                            border
                            border-black/[0.07]
                            px-1.5
                            py-0.5
                            text-[10px]
                            text-zinc-400
                            dark:border-white/[0.07]
                            dark:text-zinc-600
                        "
                    >
                        ⌘ K
                    </div>

                </div>

                {/* Mobile title */}
                <div
                    className="
                        min-w-0
                        md:hidden
                    "
                >
                    <p
                        className="
                            truncate
                            text-sm
                            font-semibold
                            text-zinc-900
                            dark:text-zinc-100
                        "
                    >
                        FileHub
                    </p>

                    <p
                        className="
                            truncate
                            text-[10px]
                            text-zinc-500
                        "
                    >
                        Personal storage
                    </p>
                </div>

            </div>

            {/* ===================================================== */}
            {/* Right */}
            {/* ===================================================== */}

            <div
                className="
                    ml-3
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    sm:gap-3
                "
            >

                {/* Notification */}
                <button
                    type="button"
                    className="
                        relative
                        rounded-xl
                        p-2.5
                        text-zinc-500
                        transition
                        hover:bg-black/[0.04]
                        hover:text-zinc-900
                        dark:hover:bg-white/[0.04]
                        dark:hover:text-zinc-200
                    "
                    aria-label="Notifications"
                >
                    <Bell size={18} />

                    <span
                        className="
                            absolute
                            right-2
                            top-2
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-violet-500
                            dark:bg-violet-400
                        "
                    />
                </button>

                {/* Theme */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    title={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    className="
                        rounded-xl
                        p-2.5
                        text-zinc-500
                        transition
                        hover:bg-black/[0.04]
                        hover:text-zinc-900
                        dark:hover:bg-white/[0.04]
                        dark:hover:text-zinc-200
                    "
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? (
                        <Sun size={18} />
                    ) : (
                        <Moon size={18} />
                    )}
                </button>

                <div
                    className="
                        hidden
                        h-6
                        w-px
                        bg-black/[0.07]
                        sm:block
                        dark:bg-white/[0.07]
                    "
                />

                {/* User */}
                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            hidden
                            text-right
                            sm:block
                        "
                    >
                        <p
                            className="
                                max-w-32
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
                                text-[10px]
                                text-zinc-500
                                dark:text-zinc-600
                            "
                        >
                            Personal account
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-violet-500/15
                            text-xs
                            font-semibold
                            text-violet-500
                            ring-1
                            ring-violet-500/10
                            dark:text-violet-300
                        "
                    >
                        {user?.name
                            ?.charAt(0)
                            .toUpperCase() ?? "U"}
                    </div>

                </div>

            </div>

        </header>
    );
};

export default Topbar;