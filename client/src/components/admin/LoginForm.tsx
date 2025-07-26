import { useForm } from "react-hook-form"
import { loginSchema, type LoginData } from "../../lib/validations/user/loginValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import type { AxiosError } from "axios"
import { assets } from "../../assets/assets"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginSuccess } from "../../redux/slices/authSlice"
import { adminApi } from "../../server/api/admin"

interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "psychologist" | "admin";
  exp: number;
  iat: number;
}

const LoginForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async(data: LoginData) => {
        try {
            const res = await adminApi.login(data)
            const { accessToken } = res
            const decoded = jwtDecode<TokenPayload>(accessToken)
            
            dispatch(
              loginSuccess({
                accessToken,
                email: decoded.email,
                role: decoded.role,
                userId: decoded.userId
              })
            )

            toast.success("Login successful");
            
            navigate('/admin/dashboard')
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.log('error is admin: ', error)
            toast.error(
            "Admin Login failed: " + error?.response?.data?.message || "Unknown error"
            );
        }
    }
  return (
    <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-1 sm:space-y-3 max-w-md mx-auto"
        >
          {/* Email Field */}
          <div className="mb-1 w-full">
            <div className="flex items-center gap-3 px-5 sm:py-2.5 rounded-lg bg-admin-extra-light">
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
            <div className="flex items-center gap-3 px-5 sm:py-2.5 rounded-lg bg-admin-extra-light">
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
              className="admin-btn-primary w-full group-hover:animate-glow-ring mb-2"
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>
          </div>
          <div>
          </div>
        </form>
  )
}

export default LoginForm
