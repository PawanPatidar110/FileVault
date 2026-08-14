import {
    User,
    Mail,
    Moon,
    Sun,
    HardDrive,
    LogOut,
    ShieldCheck,
} from "lucide-react";

import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
    const { user, logout } = useAuth();

    const {
        theme,
        toggleTheme,
    } = useTheme();

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
                        Preferences
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
                        Settings
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-zinc-500
                        "
                    >
                        Manage your account and
                        application preferences.
                    </p>

                </div>

                <div className="max-w-3xl space-y-6">

                    {/* ================================================= */}
                    {/* Account */}
                    {/* ================================================= */}

                    <section
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

                        <div
                            className="
                                border-b
                                border-black/[0.06]
                                px-5
                                py-4
                                dark:border-white/[0.05]
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
                                        bg-violet-500/10
                                        text-violet-500
                                        dark:text-violet-400
                                    "
                                >
                                    <User size={17} />
                                </div>

                                <div>
                                    <h2
                                        className="
                                            text-sm
                                            font-medium
                                            text-zinc-800
                                            dark:text-zinc-200
                                        "
                                    >
                                        Account
                                    </h2>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        Your account information.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="divide-y divide-black/[0.06] dark:divide-white/[0.05]">

                            {/* Name */}
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-6
                                    px-5
                                    py-4
                                "
                            >
                                <div className="flex items-center gap-3">

                                    <User
                                        size={16}
                                        className="
                                            text-zinc-400
                                            dark:text-zinc-600
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                text-zinc-700
                                                dark:text-zinc-300
                                            "
                                        >
                                            Name
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                text-zinc-500
                                            "
                                        >
                                            Your display name
                                        </p>
                                    </div>

                                </div>

                                <span
                                    className="
                                        max-w-[220px]
                                        truncate
                                        text-sm
                                        text-zinc-800
                                        dark:text-zinc-200
                                    "
                                >
                                    {user?.name ?? "User"}
                                </span>

                            </div>

                            {/* Email */}
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-6
                                    px-5
                                    py-4
                                "
                            >
                                <div className="flex items-center gap-3">

                                    <Mail
                                        size={16}
                                        className="
                                            text-zinc-400
                                            dark:text-zinc-600
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                text-zinc-700
                                                dark:text-zinc-300
                                            "
                                        >
                                            Email
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                text-zinc-500
                                            "
                                        >
                                            Your account email
                                        </p>
                                    </div>

                                </div>

                                <span
                                    className="
                                        max-w-[220px]
                                        truncate
                                        text-sm
                                        text-zinc-800
                                        dark:text-zinc-200
                                    "
                                >
                                    {user?.email ?? ""}
                                </span>

                            </div>

                        </div>

                    </section>

                    {/* ================================================= */}
                    {/* Appearance */}
                    {/* ================================================= */}

                    <section
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

                        <div
                            className="
                                border-b
                                border-black/[0.06]
                                px-5
                                py-4
                                dark:border-white/[0.05]
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
                                        bg-violet-500/10
                                        text-violet-500
                                        dark:text-violet-400
                                    "
                                >
                                    {theme === "dark" ? (
                                        <Moon size={17} />
                                    ) : (
                                        <Sun size={17} />
                                    )}
                                </div>

                                <div>
                                    <h2
                                        className="
                                            text-sm
                                            font-medium
                                            text-zinc-800
                                            dark:text-zinc-200
                                        "
                                    >
                                        Appearance
                                    </h2>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        Customize how FileHub looks.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-6
                                px-5
                                py-4
                            "
                        >

                            <div className="flex items-center gap-3">

                                {theme === "dark" ? (
                                    <Moon
                                        size={16}
                                        className="
                                            text-zinc-400
                                            dark:text-zinc-600
                                        "
                                    />
                                ) : (
                                    <Sun
                                        size={16}
                                        className="
                                            text-zinc-400
                                            dark:text-zinc-600
                                        "
                                    />
                                )}

                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-zinc-700
                                            dark:text-zinc-300
                                        "
                                    >
                                        {theme === "dark"
                                            ? "Dark mode"
                                            : "Light mode"}
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        Switch between light
                                        and dark appearance.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="
                                    relative
                                    h-7
                                    w-12
                                    shrink-0
                                    rounded-full
                                    bg-zinc-200
                                    transition
                                    dark:bg-violet-500
                                "
                                aria-label="Toggle theme"
                            >
                                <span
                                    className="
                                        absolute
                                        top-1
                                        h-5
                                        w-5
                                        rounded-full
                                        bg-white
                                        shadow-sm
                                        transition-transform
                                        left-1
                                        dark:translate-x-5
                                    "
                                />
                            </button>

                        </div>

                    </section>

                    {/* ================================================= */}
                    {/* Storage */}
                    {/* ================================================= */}

                    <section
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

                        <div
                            className="
                                border-b
                                border-black/[0.06]
                                px-5
                                py-4
                                dark:border-white/[0.05]
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
                                        bg-violet-500/10
                                        text-violet-500
                                        dark:text-violet-400
                                    "
                                >
                                    <HardDrive size={17} />
                                </div>

                                <div>
                                    <h2
                                        className="
                                            text-sm
                                            font-medium
                                            text-zinc-800
                                            dark:text-zinc-200
                                        "
                                    >
                                        Storage
                                    </h2>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        Your current storage usage.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="px-5 py-5">

                            <div
                                className="
                                    mb-3
                                    flex
                                    items-center
                                    justify-between
                                "
                            >
                                <span
                                    className="
                                        text-xs
                                        text-zinc-500
                                    "
                                >
                                    2.4 GB used
                                </span>

                                <span
                                    className="
                                        text-xs
                                        font-medium
                                        text-zinc-700
                                        dark:text-zinc-300
                                    "
                                >
                                    24%
                                </span>
                            </div>

                            <div
                                className="
                                    h-2
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
                                    mt-3
                                    text-[11px]
                                    text-zinc-500
                                "
                            >
                                2.4 GB of 10 GB used
                            </p>

                        </div>

                    </section>

                    {/* ================================================= */}
                    {/* Security */}
                    {/* ================================================= */}

                    <section
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

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-6
                                px-5
                                py-4
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
                                        bg-emerald-500/10
                                        text-emerald-500
                                    "
                                >
                                    <ShieldCheck
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <h2
                                        className="
                                            text-sm
                                            font-medium
                                            text-zinc-800
                                            dark:text-zinc-200
                                        "
                                    >
                                        Session
                                    </h2>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        Manage your current session.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={logout}
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-red-500/10
                                    bg-red-500/[0.05]
                                    px-3
                                    py-2
                                    text-xs
                                    font-medium
                                    text-red-500
                                    transition
                                    hover:bg-red-500/10
                                    dark:text-red-400
                                "
                            >
                                <LogOut size={14} />
                                Log out
                            </button>

                        </div>

                    </section>

                </div>

            </div>

        </AppLayout>
    );
};

export default Settings;