import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext =
    createContext<ThemeContextType | undefined>(
        undefined
    );

export const ThemeProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [theme, setThemeState] =
        useState<Theme>(() => {
            const savedTheme =
                localStorage.getItem(
                    "filehub-theme"
                );

            return savedTheme === "light"
                ? "light"
                : "dark";
        });

    useEffect(() => {
        const root =
            document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem(
            "filehub-theme",
            theme
        );
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState((currentTheme) =>
            currentTheme === "dark"
                ? "light"
                : "dark"
        );
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context =
        useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }

    return context;
};