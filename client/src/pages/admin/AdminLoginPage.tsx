import LoginForm from "../../components/admin/LoginForm"

const AdminLoginPage = () => {

    return (
        <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 bg-admin-bg-primary py-8 sm:py-12 overflow-auto">
            <div className="relative z-10 bg-admin-bg-secondary p-10 rounded-2xl shadow-2xl w-full max-w-sm mx-auto sm:w-96 text-gray-500 text-sm">
                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    Login
                </h2>
                <p className="text-center mb-4">Login to your account</p>
                <LoginForm />
            </div>
        </div>
    )

}

export default AdminLoginPage
