import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios.js'

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post(
                "/auth/send-otp",
                {
                    email: formData.email
                }
            );

            toast.success(res.data.message);

            navigate("/verify-otp", {
                state: {
                    email: formData.email,
                    nextPage: "/complete-register",
                    formData
                }
            });

        }
        catch (error) {

            toast.error(
                error.response?.data?.message
            );

        }
    };

    return (

        <div className="min-h-screen bg-[#0b1120] relative overflow-hidden flex items-center justify-center px-4">

            {/* Background */}
            <div className="absolute inset-0">

                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%)]"></div>

                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.10),transparent_30%)]"></div>

                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            </div>

            {/* Register Card */}
            <div className="relative w-full max-w-md">

                {/* Glass Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-8">

                    {/* Brand */}
                    <div className="flex items-center justify-center mb-8">

                        <div className="flex items-center gap-3">

                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">

                                <span className="text-white text-lg font-bold">
                                    S
                                </span>

                            </div>

                            <div>
                                <h2 className="text-white font-semibold text-lg tracking-wide">
                                    SocialHub
                                </h2>

                                <p className="text-gray-500 text-xs">
                                    Connect with everyone
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Heading */}
                    <div className="mb-8 text-center">

                        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
                            Create Account
                        </h1>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Join the community and start sharing your moments.
                        </p>

                    </div>

                    {/* Form */}
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit}
                    >

                        {/* Username */}
                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                onChange={handleChange}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-gray-500 outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all duration-300"
                            />

                        </div>

                        {/* Email */}
                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                onChange={handleChange}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-gray-500 outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all duration-300"
                            />

                        </div>

                        {/* Password */}
                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                onChange={handleChange}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-gray-500 outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all duration-300"
                            />

                        </div>

                        {/* Terms */}
                        {/* <div className="flex items-start gap-3 pt-1">

                            <input
                                type="checkbox"
                                className="mt-1 accent-blue-500"
                            />

                            <p className="text-sm text-gray-400 leading-relaxed">
                                I agree to the
                                <span className="text-blue-400 hover:text-blue-300 cursor-pointer ml-1">
                                    Terms & Conditions
                                </span>
                            </p>

                        </div> */}

                        {/* Button */}
                        <button
                            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-blue-900/30 transition-all duration-300 hover:translate-y-[-1px]"
                        >
                            Send OTP
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-7">

                        <div className="flex-1 h-px bg-white/10"></div>

                        <span className="text-xs text-gray-500 tracking-[0.25em]">
                            OR
                        </span>

                        <div className="flex-1 h-px bg-white/10"></div>

                    </div>

                    {/* Social Buttons */}
                    {/* <div className="grid grid-cols-2 gap-4">

                        <button className="bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] text-white rounded-2xl py-3 transition-all duration-300 font-medium">
                            Google
                        </button>

                        <button className="bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] text-white rounded-2xl py-3 transition-all duration-300 font-medium">
                            GitHub
                        </button>

                    </div> */}

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-sm mt-8">

                        Already have an account?

                        <Link
                            to="/login"
                            className="ml-2 text-white hover:text-blue-400 transition-all duration-300 font-medium"
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    )
}

export default Register