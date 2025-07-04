import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "../lib/validations/signupValidation"
import type { SignupData } from "../lib/validations/signupValidation"
import { apiClient } from "../lib/axios"
import { useState } from "react"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { toast } from "react-toastify"

type Props = {
    role: "user" | "psychologist"
}

const SignupForm = ({ role }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<SignupData>({
        resolver: zodResolver(signupSchema)
    })

    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const sendOtp = async () => {
        const email = getValues('email')
        if(!email) return toast.error("Enter email first")
        try {
            await apiClient.getInstance().post('/auth/send-otp', {email})
            setOtpSent(true)
            toast.success("OTP has been sent to your email")
        } catch (error) {
            console.log(error)
            toast.error("Error sending OTP")
        }   
    }

    const verifyOtp = async () => {
        const email = getValues("email");
        const otp = getValues("otp");
        if (!email || !otp) toast.error("Provide email and otp")
        try {
            await apiClient.getInstance().post("/auth/verify-otp", { email, otp });
            setOtpVerified(true);
            toast.success("Email has been verified")
        } catch (e) {
            console.log(e)
            toast.error("Invalid OTP")
        }
    };

    const onSubmit = async (data: SignupData) => {
        const payload = {
            ...data,
            role
        }
        if (!otpVerified) return toast.error("Please verify OTP first");
        try {
            setLoading(true);
            const res = await apiClient.getInstance().post("/auth/signup", payload);
            const token = res.data.accessToken;
            apiClient.setAuthToken(token);
            localStorage.setItem("accessToken", token);
            toast.success("Signup successful!")
            navigate('/login')
        } catch (err) {
           const error = err as AxiosError<{ error: string }>;
            alert("Signup failed: " + error?.response?.data?.error || "Unknown error");
            toast.error("Signup failed: " + error?.response?.data?.error || "Unknown error")
        } finally {
            setLoading(false);
        }
    };


    return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
    {/* Name Field */}
    <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
        <img src={assets.user} alt="" />
        <input
            {...register("name")}
            placeholder="Name"
            className="input bg-transparent outline-none w-full"
        />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
            {errors.name?.message ?? ""}
        </p>
    </div>

    {/* Email Field */}
    <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
        <img src={assets.mail} alt="" />
        <input
            {...register("email")}
            placeholder="Email"
            className="input bg-transparent outline-none w-full"
        />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
            {errors.email?.message ?? ""}
        </p>
        <div className="text-end pe-3">{!otpSent && <button type="button" onClick={sendOtp} className="btn text-cyan-500">Send OTP</button>}</div>
    </div>

    {/* OTP Field */}
    <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
        <img src={assets.message} alt="" />
        <input
            {...register("otp")}
            placeholder="OTP"
            className="input bg-transparent outline-none w-full"
        />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
            {errors.otp?.message ?? ""}
        </p>
        <div className="text-end pe-3">{!otpVerified && otpSent && <button type="button" onClick={verifyOtp} className="btn text-cyan-500">Verify OTP</button>}</div>
    </div>

    {/* Phone Field */}
    <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
        <img src={assets.phone} alt="" />
        <input
            {...register("phone")}
            placeholder="Phone"
            className="input bg-transparent outline-none w-full"
        />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
            {errors.phone?.message ?? ""}
        </p>
    </div>

    {/* Password Field */}
    <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
        <img src={assets.lock} alt="" />
        <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="input bg-transparent outline-none w-full"
        />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
            {errors.password?.message ?? ""}
        </p>
    </div>

    {/* Confirm Password Field */}
    <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
        <img src={assets.lock} alt="" />
        <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="input bg-transparent outline-none w-full"
        />
        </div>
        <p className="text-red-500 text-xs px-2 pt-1 min-h-[1rem]">
            {errors.confirmPassword?.message ?? ""}
        </p>
    </div>

    {/* Submit Button */}
    {/* disabled={loading || !otpVerified} */}
    <div className="group text-center">
        <button
        type="submit"
        className="btn-primary group-hover:animate-glow-ring"
        >
        {loading ? "Signing up..." : "Signup"}
        </button>
    </div>
    </form>
  )
}

export default SignupForm
