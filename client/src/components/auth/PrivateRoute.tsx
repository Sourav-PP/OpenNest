import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/store";

interface Props {
    allowedRoles: ("user" | "psychologist" | "admin")[]
}

const PrivateRoute: React.FC<Props> = ({allowedRoles}) => {
    const { accessToken, role } = useSelector((state: RootState) => state.auth)
    const location = useLocation()  

    if(!accessToken || !role) {
        const path = location.pathname

        let redirect = '/login?role=user'
        if(path.includes('/admin')) {
            redirect = '/admin/login'
        } else if( path.includes('/psychologist')) {
            redirect = '/login?role=psychologist'
        }

        return <Navigate to={redirect} replace/>
    }

    if (!allowedRoles.includes(role)) {
        let loginRedirect = "/login?role=user"
        if (role === "admin") {
            loginRedirect = "/admin/login";
        } 
        else if (role === "psychologist") {
            loginRedirect = "/login?role=psychologist";
        } 

        return <Navigate to={loginRedirect} replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;