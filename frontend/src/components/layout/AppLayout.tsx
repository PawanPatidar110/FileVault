import { useState, type ReactNode } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ({
    children,
}: AppLayoutProps) => {
    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);

    return (
        <div
            className="
                min-h-screen
                bg-zinc-50
                text-zinc-900
                transition-colors
                duration-200
                dark:bg-[#08090b]
                dark:text-zinc-100
            "
        >

            {/* Mobile Sidebar */}
            <Sidebar
                mobileOpen={mobileSidebarOpen}
                onMobileClose={() =>
                    setMobileSidebarOpen(false)
                }
            />

            {/* Main application */}
            <div className="min-w-0 lg:pl-64">

                <Topbar
                    onMenuClick={() =>
                        setMobileSidebarOpen(true)
                    }
                />

                <main
                    className="
                        min-h-[calc(100vh-5rem)]
                        px-4
                        py-5
                        sm:px-5
                        sm:py-6
                        lg:px-8
                        lg:py-8
                    "
                >
                    {children}
                </main>

            </div>

        </div>
    );
};

export default AppLayout;