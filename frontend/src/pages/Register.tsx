import { useState } from "react";
import {
    ArrowRight,
    Check,
    Cloud,
    Eye,
    EyeOff,
} from "lucide-react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import { registerUser } from "../api/auth.api";

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await registerUser({
                name,
                email,
                password,
            });

            navigate("/login", {
                replace: true,
            });
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                "Unable to create your account"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#08090b] text-white">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* Form */}
                <div className="
                    order-2
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    px-6
                    py-12
                    sm:px-10
                    lg:order-1
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

                        <div className="mb-8">

                            <h2 className="
                                text-3xl
                                font-semibold
                                tracking-tight
                            ">
                                Create your account
                            </h2>

                            <p className="
                                mt-2
                                text-sm
                                text-zinc-500
                            ">
                                Start managing your files in one place.
                            </p>

                        </div>

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

                            {/* Name */}
                            <div>
                                <label className="
                                    mb-2
                                    block
                                    text-xs
                                    font-medium
                                    text-zinc-400
                                ">
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Pawan Patidar"
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
                                        outline-none
                                        placeholder:text-zinc-700
                                        focus:border-violet-500/50
                                        focus:ring-4
                                        focus:ring-violet-500/[0.06]
                                    "
                                />
                            </div>

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
                                        outline-none
                                        placeholder:text-zinc-700
                                        focus:border-violet-500/50
                                        focus:ring-4
                                        focus:ring-violet-500/[0.06]
                                    "
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="
                                    mb-2
                                    block
                                    text-xs
                                    font-medium
                                    text-zinc-400
                                ">
                                    Password
                                </label>

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
                                        placeholder="Create a password"
                                        required
                                        minLength={8}
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
                                            outline-none
                                            placeholder:text-zinc-700
                                            focus:border-violet-500/50
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
                                            text-zinc-600
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

                                <div className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-[11px]
                                    text-zinc-600
                                ">
                                    <Check
                                        size={12}
                                        className="text-emerald-500"
                                    />
                                    Minimum 8 characters
                                </div>
                            </div>

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
                                    shadow-lg
                                    shadow-violet-500/10
                                    transition
                                    hover:bg-violet-400
                                    disabled:opacity-50
                                "
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create account"}

                                {!loading && (
                                    <ArrowRight size={16} />
                                )}
                            </button>

                        </form>

                        <p className="
                            mt-8
                            text-center
                            text-xs
                            text-zinc-600
                        ">
                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="
                                    font-medium
                                    text-violet-400
                                    hover:text-violet-300
                                "
                            >
                                Sign in
                            </Link>
                        </p>

                    </div>

                </div>

                {/* Brand */}
                <div className="
                    relative
                    order-1
                    hidden
                    overflow-hidden
                    border-l
                    border-white/[0.06]
                    bg-[#0b0c0f]
                    p-10
                    lg:order-2
                    lg:flex
                    lg:flex-col
                    lg:justify-between
                    xl:p-14
                ">

                    <div className="
                        pointer-events-none
                        absolute
                        right-[-100px]
                        top-[-100px]
                        h-96
                        w-96
                        rounded-full
                        bg-violet-600/10
                        blur-[100px]
                    " />

                    <div className="
                        pointer-events-none
                        absolute
                        bottom-[-100px]
                        left-[-100px]
                        h-96
                        w-96
                        rounded-full
                        bg-violet-500/[0.06]
                        blur-[100px]
                    " />

                    <div className="relative flex items-center gap-3">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-violet-500
                        ">
                            <Cloud
                                size={20}
                                className="text-white"
                            />
                        </div>

                        <span className="text-lg font-semibold">
                            FileHub
                        </span>

                    </div>

                    <div className="relative">

                        <p className="
                            mb-5
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-violet-400
                        ">
                            Simple. Secure. Yours.
                        </p>

                        <h1 className="
                            text-5xl
                            font-semibold
                            leading-[1.08]
                            tracking-[-0.04em]
                            xl:text-6xl
                        ">
                            Your files deserve
                            <br />
                            <span className="text-zinc-500">
                                a better home.
                            </span>
                        </h1>

                        <p className="
                            mt-7
                            max-w-md
                            text-sm
                            leading-6
                            text-zinc-500
                        ">
                            Keep your documents, images and
                            projects organized and accessible
                            whenever you need them.
                        </p>

                    </div>

                    <p className="relative text-[11px] text-zinc-700">
                        © 2026 FileHub
                    </p>

                </div>

            </div>
        </div>
    );
};

export default Register;
