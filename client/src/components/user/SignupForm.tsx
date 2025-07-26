import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../lib/validations/user/signupValidation";
import type { SignupData } from "../../lib/validations/user/signupValidation";
import { useState } from "react";
import type { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { authApi } from "../../server/api/auth";

interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "psychologist" | "admin";
  exp: number;
  iat: number;
}

const SignupForm = () => {
  const [searchParams] = useSearchParams()
  const roleFromUrl = (searchParams.get('role') ?? "user") as "user" | "psychologist"
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const sendOtp = async () => {
    const email = getValues("email");
    if (!email) return toast.error("Enter email first");
    setOtpLoading(true);
    try {
      await authApi.sendOtp({email})
      setOtpSent(true);
      toast.success("OTP has been sent to your email");
    } catch (error) {
      console.log(error);
      toast.error("Error sending OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    const email = getValues("email");
    const otp = getValues("otp");
    if (!email || !otp) toast.error("Provide email and otp");
    setVerifyLoading(true);
    try {
      await authApi.verifyOtp({email, otp})
      setOtpVerified(true);
      toast.success("Email has been verified");
    } catch (e) {
      console.log(e);
      toast.error("Invalid OTP");
    } finally {
      setVerifyLoading(false);
    }
  };

  const onSubmit = async (data: SignupData) => {
    if (!otpVerified) return toast.error("Please verify OTP first");

    const payload = {
      ...data,
      role: roleFromUrl,
    };
    
    try {
      const res = await authApi.signup(payload)
      console.log(res)
      const accessToken = res.accessToken;
      
      const decoded = jwtDecode<TokenPayload>(accessToken)

      dispatch(
        loginSuccess({
          accessToken,
          email: decoded.email,
          role: decoded.role,
          userId: decoded.userId
        })
      )

      toast.success("Signup successful!");

      console.log("decoded role", decoded.role)
      
      if (decoded.role === "psychologist") {
        navigate("/psychologist/verification'");
      } else {
        navigate("/home");
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(
        "Signup failed: " + error?.response?.data?.error || "Something went wrong"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
    >
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
        <div className="text-end pe-3">
          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              className="btn text-cyan-500"
              disabled={otpLoading}
            >
             {otpLoading ? (
                <span className="animate-spin w-4 h-4 border-2 mt-1 p-1 border-t-transparent border-cyan-500 rounded-full">Loading...</span>
             ) : (
                 "Send OTP"
             )}
            </button>
          )}
        </div>
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
        <div className="text-end pe-3">
          {!otpVerified && otpSent && (
            <button
              type="button"
              onClick={verifyOtp}
              className="btn text-cyan-500"
              disabled={verifyLoading}
            >
              {verifyLoading ? (
                <span className="animate-spin w-4 h-4 border-2 border-t-transparent border-cyan-500 rounded-full">Loading...</span>
              ) : (
                "Verify OTP"
              )}
            </button>
          )}
        </div>
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
      <div className="group text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary group-hover:animate-glow-ring"
        >
          {isSubmitting ? "Signing up..." : "Signup"}
        </button>
      </div>
      <p className="text-center">Already have an account?<span className="text-[#70A5FF] cursor-pointer" onClick={() => navigate(`/login?role=${roleFromUrl ?? "user"}`)}> Login</span></p>
    </form>
  );
};

export default SignupForm;
