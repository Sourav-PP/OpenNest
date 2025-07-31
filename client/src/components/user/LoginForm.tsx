import { useForm } from "react-hook-form";
import { loginSchema } from "../../lib/validations/user/loginValidation";
import type { LoginData } from "../../lib/validations/user/loginValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { assets } from "../../assets/assets";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { authApi } from "../../server/api/auth";
import GoogleLoginButton from "./GoogleLoginButton";

interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "psychologist" | "admin";
  exp: number;
  iat: number;
}

const LoginForm = () => {
  const [searchParams] = useSearchParams()
  const roleFromUrl = searchParams.get('role')

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { 
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
} = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await authApi.login(data)
      console.log("response: ", res)
      const { accessToken, hasSubmittedVerificationForm  } = res;

      const decoded = jwtDecode<TokenPayload>(accessToken)
      
      dispatch(
        loginSuccess({
          accessToken,
          email: decoded.email,
          role: decoded.role,
          userId: decoded.userId,
          isSubmittedVerification: true
        })
      )

      toast.success("Login successful");

      // navigation based on role
      if(decoded.role === 'psychologist') {
        if(hasSubmittedVerificationForm) {
          console.log("Navigating to profile");
          navigate('/psychologist/profile')
        }else{
          console.log("Navigating to verification");
          navigate('/psychologist/verification')
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.log('error is: ', error)
      toast.error(
        "Login failed: " + error?.response?.data?.error || "Unknown error"
      );
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-1 sm:space-y-3 max-w-md mx-auto"
    >
      {/* Email Field */}
      <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-100">
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
      </div>

      {/* Password Field */}
      <div className="mb-1 w-full">
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-100">
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

      {/* Submit Button */}
      <div className="group text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full group-hover:animate-glow-ring mb-2"
        >
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </div>
        <GoogleLoginButton/>
      <div>

      
      <p className="text-center">Don't have an account?<span className="text-[#70A5FF] cursor-pointer"
         onClick={() => navigate(`/signup?role=${roleFromUrl ?? "user"}`)}> Sign up</span></p>
      </div>
    </form>
  );
};

export default LoginForm;
