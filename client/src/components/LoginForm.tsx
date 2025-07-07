import { useForm } from "react-hook-form";
import { loginSchema } from "../lib/validations/loginValidation";
import type { LoginData } from "../lib/validations/loginValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { assets } from "../assets/assets";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { apiClient } from "../lib/axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const { 
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
} = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await apiClient.getInstance().post("/auth/login", data, {
        withCredentials: true,
      });

      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      apiClient.setAuthToken(accessToken);
      toast.success("Login successful");
      navigate("/home");
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
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-slate-100">
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
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-slate-100">
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
      <div>
      <p className="text-center cursor-pointer hover:text-[#70A5FF]">Forgot Password?</p>
      <p className="text-center">Don't have an account?<span className="text-[#70A5FF] cursor-pointer"> Sign up</span></p>
      </div>
    </form>
  );
};

export default LoginForm;
