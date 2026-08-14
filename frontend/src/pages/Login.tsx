import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Cloud } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email, password);

            navigate("/dashboard", {
                replace: true,
            });
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#08090b] text-white">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* Brand section */}
                <div className="
                    relative
                    hidden
                    overflow-hidden
                    border-r
                    border-white/[0.06]
                    bg-[#0b0c0f]
                    lg:flex
                    lg:flex-col
                    lg:justify-between
                    p-10
                    xl:p-14
                ">

                    {/* Background glow */}
                    <div className="
                        pointer-events-none
                        absolute
                        -left-32
                        -top-32
                        h-96
                        w-96
                        rounded-full
                        bg-violet-600/10
                        blur-[100px]
                    " />

                    <div className="
                        pointer-events-none
                        absolute
                        bottom-0
                        right-0
                        h-80
                        w-80
                        rounded-full
                        bg-violet-500/[0.06]
                        blur-[100px]
                    " />

                    {/* Logo */}
                    <div className="relative flex items-center gap-3">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-violet-500
                            shadow-lg
                            shadow-violet-500/20
                        ">
                            <Cloud
                                size={20}
                                className="text-white"
                            />
                        </div>

                        <span className="text-lg font-semibold tracking-tight">
                            FileHub
                        </span>

                    </div>

                    {/* Main message */}
                    <div className="relative max-w-xl">

                        <p className="
                            mb-5
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.2em]
                            text-violet-400
                        ">
                            Your files. Your space.
                        </p>

                        <h1 className="
                            text-5xl
                            font-semibold
                            leading-[1.08]
                            tracking-[-0.04em]
                            text-white
                            xl:text-6xl
                        ">
                            Everything important,
                            <br />
                            <span className="text-zinc-500">
                                right where it belongs.
                            </span>
                        </h1>

                        <p className="
                            mt-7
                            max-w-md
                            text-sm
                            leading-6
                            text-zinc-500
                        ">
                            Store, manage and share your files
                            from one simple, secure workspace.
                        </p>

                    </div>

                    {/* Footer */}
                    <div className="relative flex items-center justify-between">

                        <p className="text-[11px] text-zinc-700">
                            © 2026 FileHub
                        </p>

                        <p className="text-[11px] text-zinc-700">
                            Secure cloud storage
                        </p>

                    </div>

                </div>

                {/* Form section */}
                <div className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    px-6
                    py-12
                    sm:px-10
                ">

                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <div className="mb-12 flex items-center gap-3 lg:hidden">

                            <div className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                bg-violet-500
                            ">
                                <Cloud
                                    size={18}
                                    className="text-white"
                                />
                            </div>

                            <span className="font-semibold">
                                FileHub
                            </span>

                        </div>

                        {/* Heading */}
                        <div className="mb-8">

                            <h2 className="
                                text-3xl
                                font-semibold
                                tracking-tight
                                text-white
                            ">
                                Welcome back
                            </h2>

                            <p className="
                                mt-2
                                text-sm
                                text-zinc-500
                            ">
                                Sign in to continue to your workspace.
                            </p>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="
                                mb-5
                                rounded-xl
                                border
                                border-red-500/15
                                bg-red-500/[0.06]
                                px-4
                                py-3
                                text-xs
                                text-red-300
                            ">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}
                            <div>
                                <label className="
                                    mb-2
                                    block
                                    text-xs
                                    font-medium
                                    text-zinc-400
                                ">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    required
                                    className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/[0.08]
                                        bg-white/[0.025]
                                        px-4
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-zinc-700
                                        transition
                                        focus:border-violet-500/50
                                        focus:bg-white/[0.04]
                                        focus:ring-4
                                        focus:ring-violet-500/[0.06]
                                    "
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">

                                    <label className="
                                        text-xs
                                        font-medium
                                        text-zinc-400
                                    ">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="
                                            text-[11px]
                                            text-violet-400
                                            transition
                                            hover:text-violet-300
                                        "
                                    >
                                        Forgot password?
                                    </button>

                                </div>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        required
                                        className="
                                            h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-white/[0.08]
                                            bg-white/[0.025]
                                            px-4
                                            pr-12
                                            text-sm
                                            text-white
                                            outline-none
                                            placeholder:text-zinc-700
                                            transition
                                            focus:border-violet-500/50
                                            focus:bg-white/[0.04]
                                            focus:ring-4
                                            focus:ring-violet-500/[0.06]
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (value) => !value
                                            )
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            rounded-lg
                                            p-1.5
                                            text-zinc-600
                                            transition
                                            hover:text-zinc-300
                                        "
                                    >
                                        {showPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    flex
                                    h-12
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-violet-500
                                    text-sm
                                    font-medium
                                    text-white
                                    shadow-lg
                                    shadow-violet-500/10
                                    transition
                                    hover:bg-violet-400
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    active:scale-[0.99]
                                "
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign in"}

                                {!loading && (
                                    <ArrowRight size={16} />
                                )}
                            </button>

                        </form>

                        {/* Register */}
                        <p className="
                            mt-8
                            text-center
                            text-xs
                            text-zinc-600
                        ">
                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="
                                    font-medium
                                    text-violet-400
                                    transition
                                    hover:text-violet-300
                                "
                            >
                                Create one
                            </Link>
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Login;