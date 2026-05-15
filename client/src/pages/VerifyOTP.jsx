import {
    useState
} from "react";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/axios";

function VerifyOTP() {

    const navigate = useNavigate();

    const location = useLocation();

    const email = location.state?.email;

    const nextPage = location.state?.nextPage;

    const [otp, setOtp] = useState("");


    const handleVerify = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post(
                "/auth/verify-otp",
                {
                    email,
                    otp
                }
            );

            toast.success(res.data.message);

            navigate(nextPage, {
                state: location.state
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

            {/* OTP Card */}
            <div className="relative w-full max-w-md">

                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-8">

                    {/* Brand */}
                    <div className="flex items-center justify-center mb-8">

                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">

                            <span className="text-2xl">
                                🔐
                            </span>

                        </div>

                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">

                        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
                            Verify OTP
                        </h1>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Enter the verification code sent to your email.
                        </p>

                        <p className="text-blue-400 text-sm mt-3 break-all font-medium">
                            {email}
                        </p>

                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleVerify}
                        className="space-y-6"
                    >

                        {/* OTP Input */}
                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                One Time Password
                            </label>

                            <input
                                type="text"
                                placeholder="• • • • • •"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all duration-300 text-center tracking-[10px] text-2xl font-semibold"
                            />

                        </div>

                        {/* Verify Button */}
                        <button
                            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-blue-900/30 transition-all duration-300 hover:translate-y-[-1px]"
                        >
                            Verify OTP
                        </button>

                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">

                        <p className="text-gray-500 text-sm">
                            Didn’t receive the OTP?
                        </p>

                        <button
                            type="button"
                            className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-all duration-300"
                        >
                            Resend Code
                        </button>

                    </div>

                </div>

            </div>

        </div>

    )

}

export default VerifyOTP